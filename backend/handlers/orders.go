package handlers

import (
	"ecommerce-backend/database"
	"ecommerce-backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateOrder creates a new order from the user's cart
func CreateOrder(c *gin.Context) {
	user, _ := c.Get("user")
	currentUser := user.(models.User)

	// Start transaction
	tx := database.GetDB().Begin()

	// Get user's active cart
	var cart models.Cart
	result := tx.Preload("CartItems.Item").
		Where("user_id = ? AND is_checked_out = ?", currentUser.ID, false).
		First(&cart)

	if result.Error != nil {
		tx.Rollback()
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusBadRequest, gin.H{"error": "no active cart found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to process order"})
		return
	}

	// Check if cart is empty
	if len(cart.CartItems) == 0 {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "cart is empty"})
		return
	}

	// Calculate total
	var total float64
	for _, item := range cart.CartItems {
		total += item.Item.Price * float64(item.Quantity)
	}

	// Create order
	now := time.Now()
	order := models.Order{
		UserID:    currentUser.ID,
		CartID:    cart.ID,
		Total:     total,
		Status:    "completed",
	}

	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create order"})
		return
	}

	// Mark cart as checked out
	cart.IsCheckedOut = true
	cart.CheckedOutAt = &now
	if err := tx.Save(&cart).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update cart status"})
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to process order"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "order created successfully",
		"order_id": order.ID,
	})
}

// GetOrders returns all orders (admin only)
func GetOrders(c *gin.Context) {
	var orders []models.Order
	result := database.GetDB().Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, username") // Only select necessary user fields
	}).Preload("Cart.CartItems.Item").Find(&orders)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch orders"})
		return
	}

	// Format response
	var response []map[string]interface{}
	for _, order := range orders {
		orderData := map[string]interface{}{
			"id":         order.ID,
			"user_id":    order.UserID,
			"username":   order.User.Username,
			"total":      order.Total,
			"status":     order.Status,
			"created_at": order.CreatedAt,
			"items":      []map[string]interface{}{},
		}

		// Add cart items
		for _, item := range order.Cart.CartItems {
			orderData["items"] = append(orderData["items"].([]map[string]interface{}), map[string]interface{}{
				"id":          item.ItemID,
				"name":        item.Item.Name,
				"description": item.Item.Description,
				"price":       item.Item.Price,
				"quantity":    item.Quantity,
			})
		}

		response = append(response, orderData)
	}

	c.JSON(http.StatusOK, gin.H{"orders": response})
}

// GetUserOrders returns the current user's orders
func GetUserOrders(c *gin.Context) {
	user, _ := c.Get("user")
	currentUser := user.(models.User)

	var orders []models.Order
	result := database.GetDB().Preload("Cart.CartItems.Item").
		Where("user_id = ?", currentUser.ID).
		Order("created_at DESC").
		Find(&orders)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch orders"})
		return
	}

	// Format response
	var response []map[string]interface{}
	for _, order := range orders {
		orderData := map[string]interface{}{
			"id":         order.ID,
			"total":      order.Total,
			"status":     order.Status,
			"created_at": order.CreatedAt,
			"items":      []map[string]interface{}{},
		}

		// Add cart items
		for _, item := range order.Cart.CartItems {
			orderData["items"] = append(orderData["items"].([]map[string]interface{}), map[string]interface{}{
				"id":          item.ItemID,
				"name":        item.Item.Name,
				"description": item.Item.Description,
				"price":       item.Item.Price,
				"quantity":    item.Quantity,
			})
		}

		response = append(response, orderData)
	}

	c.JSON(http.StatusOK, gin.H{"orders": response})
}
