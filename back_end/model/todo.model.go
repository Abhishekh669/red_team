package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Tag string

const (
	High   Tag = "HIGH"
	Medium Tag = "MEDIUM"
	Low    Tag = "LOW"
)

// State represents the current state of a task.
type State string

const (
	Pending State = "PENDING"
	Ongoing State = "ONGOING"
	Done    State = "DONE"
)

type Todo struct {
	ID          string             `json:"_id,omitempty" bson:"_id,omitempty"` // MongoDB uses `_id` as the primary key
	UserID      primitive.ObjectID `json:"userId" bson:"userId"`
	Title       string             `json:"title" bson:"title"`
	Position    int64              `json:"position" bson:"position"`
	Description string             `json:"description,omitempty" bson:"description,omitempty"`
	Tag         Tag                `json:"tag" bson:"tag"`
	State       State              `json:"state" bson:"state"`
	CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt" bson:"updatedAt"`
}

type TodoRequest struct {
	Title       string `json:"title" bson:"title"`
	Description string `json:"description,omitempty" bson:"description,omitempty"`
	Tag         Tag    `json:"tag" bson:"tag"`
	State       State  `json:"state" bson:"state"`
}
