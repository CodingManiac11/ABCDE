package handlers

import (
	"ecommerce-backend/database"
	"ecommerce-backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AddToCartRequest struct {
	ItemID   uint `json:"item_id" binding:"required"`
	Quantity int  `json:"quantity" binding:"required,min=1"`
}

// AddToCart adds an item to the user's cart or updates the quantity if already exists
func AddToCart(c *gin.Context) {
	user, _ := c.Get("user")
	currentUser := user.(models.User)

	var req AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Start transaction
	tx := database.GetDB().Begin()

	// Get or create user's active cart
	var cart models.Cart
	result := tx.Where("user_id = ? AND is_checked_out = ?", currentUser.ID, false).FirstOrCreate(&cart, models.Cart{
		UserID:       currentUser.ID,
		IsCheckedOut: false,
	})

	if result.Error != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get or create cart"})
		return
	}

	// Check if item exists
	var item models.Item
	if err := tx.First(&item, req.ItemID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "item not found"})
		return
	}

	// Add item to cart or update quantity
	var cartItem models.CartItem
	if err := tx.Where("cart_id = ? AND item_id = ?", cart.ID, req.ItemID).First(&cartItem).Error; err == nil {
		// Item already in cart, update quantity
		cartItem.Quantity += req.Quantity
		if err := tx.Save(&cartItem).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update cart"})
			return
		}
	} else if err == gorm.ErrRecordNotFound {
		// Item not in cart, add new item
		cartItem = models.CartItem{
			CartID:   cart.ID,
			ItemID:   req.ItemID,
			Quantity: req.Quantity,
		}
		if err := tx.Create(&cartItem).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add item to cart"})
			return
		}
	} else {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to process cart"})
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "item added to cart successfully",
		"cart_id": cart.ID,
	})
}

// GetCarts returns all carts (admin only)
func GetCarts(c *gin.Context) {
	var carts []models.Cart
	result := database.GetDB().Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, username") // Only select necessary user fields
	}).Preload("CartItems.Item").Find(&carts)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch carts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"carts": carts})
}

// GetUserCart returns the current user's active cart
func GetUserCart(c *gin.Context) {
	user, _ := c.Get("user")
	currentUser := user.(models.User)

	var cart models.Cart
	result := database.GetDB().Preload("CartItems.Item").
		Where("user_id = ? AND is_checked_out = ?", currentUser.ID, false).
		First(&cart)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			// Return empty cart if not found
			c.JSON(http.StatusOK, gin.H{"cart": nil, "items": []interface{}{}})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch cart"})
		return
	}

	// Calculate total
	var total float64
	var items []map[string]interface{}
	for _, ci := range cart.CartItems {
		total += ci.Item.Price * float64(ci.Quantity)
		items = append(items, map[string]interface{}{
			"id":          ci.ItemID,
			"name":        ci.Item.Name,
			"description": ci.Item.Description,
			"price":       ci.Item.Price,
			"quantity":    ci.Quantity,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"cart_id": cart.ID,
		"items":   items,
		"total":   total,
	})
}
