package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TestData struct {
	Score   float32 `json:"score" bson:"score"`
	Correct int32   `json:"correct" bson:"correct"`
	// Name    string `json:"name" bson:"name"`
	// Eamil   string `json:"email" bson:"email"`
	Status string `json:"status" bson:"status"` //either "attempted" || "not attempted"
	// Image   string `json:"image" bson:"image"`
}

type Test struct {
	ID             primitive.ObjectID  `json:"_id,omitempty" bson:"_id,omitempty"`
	CreatedAt      time.Time           `json:"createdAt" bson:"createdAt"`
	Date           time.Time           `json:"date" bson:"date"`
	TotalMarks     int32               `json:"totalMarks" bson:"totalMarks"`
	PassMarks      int32               `json:"passMarks" bson:"passMarks"`
	TotalQuestions int32               `json:"totalQuestions" bson:"totalQuestions"`
	TestData       map[string]TestData `json:"testData,omitempty" bson:"testData,omitempty"`
	SubmittedBy    string              `json:"submittedBy" bson:"submittedBy"`
}

type TestRequest struct {
	TotalMarks     int32     `json:"totalMarks" bson:"totalMarks"`
	PassMarks      int32     `json:"passMarks" bson:"passMarks"`
	TotalQuestions int32     `json:"totalQuestions" bson:"totalQuestions"`
	Date           time.Time `json:"date" bson:"date"`
	SubmittedBy    string    `json:"submittedBy" bson:"submittedBy"`
}
