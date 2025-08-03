package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username     string `gorm:"uniqueIndex;not null"`
	PasswordHash string `gorm:"not null"`
	Token        string `gorm:"index"`
	Carts        []Cart `gorm:"foreignKey:UserID"`
	Orders       []Order `gorm:"foreignKey:UserID"`
}

type Item struct {
	gorm.Model
	Name        string  `gorm:"not null"`
	Description string
	Price       float64 `gorm:"not null"`
	CartItems   []CartItem `gorm:"foreignKey:ItemID"`
}

type Cart struct {
	gorm.Model
	UserID     uint       `gorm:"not null"`
	IsCheckedOut bool      `gorm:"default:false"`
	CheckedOutAt *time.Time
	CartItems  []CartItem `gorm:"foreignKey:CartID"`
	Order      *Order     `gorm:"foreignKey:CartID"`
}

type CartItem struct {
	gorm.Model
	CartID     uint   `gorm:"not null"`
	ItemID     uint   `gorm:"not null"`
	Item       Item   `gorm:"foreignKey:ItemID"`
	Quantity   int    `gorm:"default:1"`
}

type Order struct {
	gorm.Model
	UserID    uint      `gorm:"not null"`
	CartID    uint      `gorm:"not null"`
	Cart      Cart      `gorm:"foreignKey:CartID"`
	Total     float64   `gorm:"not null"`
	Status    string    `gorm:"default:'pending'"`
}
