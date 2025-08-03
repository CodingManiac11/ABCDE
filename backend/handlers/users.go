package handlers

import (
	"ecommerce-backend/database"
	"ecommerce-backend/models"
	"ecommerce-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateUserRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// CreateUser handles user registration
func CreateUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists
	exists := false
	database.GetDB().Model(&models.User{}).Select("count(*) > 0").Where("username = ?", req.Username).Find(&exists)
	if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "username already exists"})
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		return
	}

	// Generate token
	token, err := utils.GenerateToken(req.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	// Create user
	user := models.User{
		Username:     req.Username,
		PasswordHash: hashedPassword,
		Token:        token,
	}

	result := database.GetDB().Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "user created successfully",
		"token":   token,
	})
}

// Login handles user login
func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find user by username
	var user models.User
	result := database.GetDB().Where("username = ?", req.Username).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	// Check password
	if err := utils.CheckPassword(req.Password, user.PasswordHash); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	// Generate new token
	token, err := utils.GenerateToken(user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	// Update user token in database
	user.Token = token
	database.GetDB().Save(&user)

	c.JSON(http.StatusOK, gin.H{
		"message": "login successful",
		"token":   token,
	})
}

// GetUsers returns a list of all users (admin only)
func GetUsers(c *gin.Context) {
	var users []models.User
	result := database.GetDB().Find(&users)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch users"})
		return
	}

	// Remove sensitive data
	var response []gin.H
	for _, user := range users {
		response = append(response, gin.H{
			"id":       user.ID,
			"username": user.Username,
		})
	}

	c.JSON(http.StatusOK, gin.H{"users": response})
}
