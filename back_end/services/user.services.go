package services

import (
	"context"
	"fmt"
	"time"

	"github.com/Abhishekh669/backend/configuration"
	"github.com/Abhishekh669/backend/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetTestDataByUserId(userId string) ([]model.Test, error) {
	// Get the MongoDB collection
	testCollection, err := configuration.GetCollection("test")
	if err != nil {
		return nil, fmt.Errorf("failed to get the test collection: %v", err)
	}

	// Create a context with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Define the aggregation pipeline
	matchStage := bson.D{
		{Key: "$match", Value: bson.D{
			{Key: "testData." + userId, Value: bson.D{{Key: "$exists", Value: true}}},
		}},
	}

	projectStage := bson.D{
		{Key: "$project", Value: bson.D{
			{Key: "_id", Value: 1},            // Include the _id field
			{Key: "createdAt", Value: 1},      // Include the createdAt field
			{Key: "date", Value: 1},           // Include the date field
			{Key: "totalMarks", Value: 1},     // Include the totalMarks field
			{Key: "passMarks", Value: 1},      // Include the passMarks field
			{Key: "totalQuestions", Value: 1}, // Include the totalQuestions field
			{Key: "testData", Value: bson.D{
				{Key: userId, Value: "$testData." + userId}, // Only include testData for the specific userId
			}},
			{Key: "submittedBy", Value: 1}, // Include the submittedBy field
		}},
	}

	// Create the aggregation pipeline
	pipeline := mongo.Pipeline{matchStage, projectStage}

	// Execute the aggregation
	cursor, err := testCollection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("failed to execute aggregation: %v", err)
	}
	defer cursor.Close(ctx)
	fmt.Println("curosr ", cursor)

	// Decode all matching documents
	var results []model.Test
	for cursor.Next(ctx) {

		var test model.Test

		if err := cursor.Decode(&test); err != nil {
			return nil, fmt.Errorf("failed to decode result: %v", err)
		}
		fmt.Println("this is result  resut : ", test)

		// If the testData field exists, we verify if it contains data for the userId
		if test.TestData != nil {
			// Ensure the testData contains only the relevant user's data
			userData, exists := test.TestData[userId]
			if exists {
				// Retain only the userId's testData
				test.TestData = map[string]model.TestData{userId: userData}
			} else {
				// No data for the userId, set testData to nil
				test.TestData = nil
			}
		}

		// Append the result if testData for userId exists
		if test.TestData != nil {
			results = append(results, test)
		}
	}

	// If no documents are found for the given userId
	if len(results) == 0 {
		return nil, fmt.Errorf("no test data found for user %s", userId)
	}

	return results, nil
}

func CreateUser(user model.User) (model.User, error) {
	user_collection, err := configuration.GetCollection("users")

	if err != nil {
		return model.User{}, fmt.Errorf("could not get the user collection: %v", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	if user.CreatedAt.IsZero() {
		user.CreatedAt = time.Now()
	}
	fmt.Println("This is the user for creation :", user)

	result, err := user_collection.InsertOne(ctx, user)

	if err != nil {
		return model.User{}, fmt.Errorf("failed to create user: %v", err)
	}

	user.ID = result.InsertedID.(primitive.ObjectID)
	fmt.Println("This is user after creting user : ", user)
	return user, nil

}

func GetUserById(id primitive.ObjectID) (model.User, error) {

	filter := bson.D{{Key: "_id", Value: id}}

	var user model.User

	user_collection, err := configuration.GetCollection("users")

	if err != nil {
		return model.User{}, fmt.Errorf("could not get the user collection: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = user_collection.FindOne(ctx, filter).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return model.User{}, fmt.Errorf("no user found : %v", err)
		} else {
			return model.User{}, fmt.Errorf("failed to find the user")
		}
	}
	return user, nil

}

func CheckUser(email string) (model.User, error) {
	if email == "" {
		return model.User{}, fmt.Errorf("email or google id missing")
	}

	user_collection, err := configuration.GetCollection("users")

	if err != nil {
		return model.User{}, fmt.Errorf("could not get the user collection: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	fmt.Println("this is the context : ", ctx)

	var result model.User
	err = user_collection.FindOne(ctx, bson.M{"email": email}).Decode(&result)
	fmt.Println("THis ishte reuslt after search the user ", result)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return model.User{}, fmt.Errorf("no user found : %v", err)
		} else {
			return model.User{}, fmt.Errorf("failed to find the user")
		}
	}
	fmt.Println("THis is check user ", result)
	return result, nil

}

func GetAllUsers() ([]model.User, error) {
	user_collection, err := configuration.GetCollection("users")
	if err != nil {
		return []model.User{}, fmt.Errorf("could not get the user collection: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result []model.User
	cursor, err := user_collection.Find(ctx, bson.M{})
	if err != nil {
		return []model.User{}, fmt.Errorf("faild to get users")
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var user model.User
		if err := cursor.Decode(&user); err != nil {
			return []model.User{}, fmt.Errorf("failed to decode user: %v", err)
		}
		result = append(result, user)

	}

	if err := cursor.Err(); err != nil {
		return []model.User{}, fmt.Errorf("cursor error : %v", err)
	}

	return result, nil

}

func OnboardingUser(onboarding_data model.OnboardingRequest, userId primitive.ObjectID) (model.User, error) {
	if userId.IsZero() {
		return model.User{}, fmt.Errorf("no user id provided")
	}

	user_collection, err := configuration.GetCollection("users")
	if err != nil {
		return model.User{}, fmt.Errorf("could not get the user collection: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"codeName":      onboarding_data.CodeName,
			"phoneNumber":   onboarding_data.PhoneNumber,
			"address":       onboarding_data.Address,
			"age":           onboarding_data.Age,
			"qualification": onboarding_data.Qualification,
			"field":         onboarding_data.Field,
			"isOnBoarded":   true,
			"mainField":     onboarding_data.MainField,
		},
	}

	filter := bson.M{"_id": userId}

	result, err := user_collection.UpdateOne(ctx, filter, update)

	if err != nil {
		return model.User{}, fmt.Errorf("failed to update user")
	}

	if result.MatchedCount == 0 {
		return model.User{}, fmt.Errorf("user not found")
	}

	var updatedUser model.User
	err = user_collection.FindOne(ctx, filter).Decode(&updatedUser)

	if err != nil {
		return model.User{}, fmt.Errorf("failed to fetch updated user: %v", err)
	}

	return updatedUser, nil

}
