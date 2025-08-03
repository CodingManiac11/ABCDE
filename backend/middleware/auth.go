package middleware

import (
	"ecommerce-backend/database"
	"ecommerce-backend/models"
	"ecommerce-backend/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader { // No Bearer prefix found
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token not found in Authorization header"})
			c.Abort()
			return
		}

		username, err := utils.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Get user from database
		var user models.User
		result := database.GetDB().Where("username = ? AND token = ?", username, tokenString).First(&user)
		if result.Error != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user session"})
			c.Abort()
			return
		}

		// Add user to context
		c.Set("user", user)
		c.Next()
	}
}
