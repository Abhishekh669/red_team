package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Document represents a MongoDB collection model
type PageModel struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Title       string             `bson:"title" json:"title"`
	Content     string             `bson:"content,omitempty" json:"content,omitempty"`
	Description string             `bson:"description,omitempty" json:"description,omitempty"`
	Type        string             `bson:"type" json:"type"`
	UserId      primitive.ObjectID `bson:"userId" json:"userId"`
	CreatedAt   time.Time          `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt   time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

type PageModelRequest struct {
	Title       string `bson:"title" json:"title"`
	Description string `bson:"description,omitempty" json:"description,omitempty"`
	Type        string `bson:"type" json:"type"`
}

type UpdatePageData struct {
	ID      primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Title   string             `bson:"title" json:"title"`
	Content string             `bson:"content,omitempty" json:"conten,omitempty"`
	UserId  primitive.ObjectID `bson:"userId" json:"userId"`
}

type UpdatePageDataRequest struct {
	ID      string `bson:"_id,omitempty" json:"_id,omitempty"`
	Title   string `bson:"title" json:"title"`
	Content string `bson:"content,omitempty" json:"conten,omitempty"`
}
