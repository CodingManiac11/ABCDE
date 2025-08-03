package handlers

import (
	"ecommerce-backend/database"
	"ecommerce-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateItemRequest struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price" binding:"required,gt=0"`
}

// CreateItem handles creating a new item (admin only)
func CreateItem(c *gin.Context) {
	var req CreateItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create item
	item := models.Item{
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
	}

	result := database.GetDB().Create(&item)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create item"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "item created successfully",
		"item":    item,
	})
}

// GetItems returns a list of all items
func GetItems(c *gin.Context) {
	var items []models.Item
	result := database.GetDB().Find(&items)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch items"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}
