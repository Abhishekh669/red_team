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

func CreateQuickTask(task model.ReadingItem) (bool, error) {
	// Get the collection for tasks
	taskCollection, err := configuration.GetCollection("tasks") // Replace "tasks" with your collection name
	if err != nil {
		return false, fmt.Errorf("could not get the tasks collection: %v", err)
	}

	// Set a timeout for the operation
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Insert the task into the collection
	result, err := taskCollection.InsertOne(ctx, task)
	if err != nil {
		return false, fmt.Errorf("failed to create quick task: %v", err)
	}

	// Set the generated ID to the task
	task.ID = result.InsertedID.(primitive.ObjectID)

	fmt.Println("This is the task after creating:", task)
	return true, nil
}

func GetUserQuickTaskList(userId primitive.ObjectID) ([]model.ReadingItem, error) {
	taskCollection, err := configuration.GetCollection("tasks") // Replace "tasks" with your collection name
	if err != nil {
		return nil, fmt.Errorf("could not get the tasks collection: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"userId": userId,
	}

	cursor, err := taskCollection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to find tasks: %v", err)
	}
	defer cursor.Close(ctx)

	var tasks []model.ReadingItem
	if err := cursor.All(ctx, &tasks); err != nil {
		return nil, fmt.Errorf("failed to decode tasks: %v", err)
	}

	return tasks, nil
}

func GetQuickTaskById(id primitive.ObjectID, userId primitive.ObjectID) (model.ReadingItem, error) {

	taskCollection, err := configuration.GetCollection("tasks")
	if err != nil {
		return model.ReadingItem{}, fmt.Errorf("failed to get the tasks collection: %v", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	filter := bson.M{
		"_id":    id,
		"userId": userId,
	}

	var task model.ReadingItem

	err = taskCollection.FindOne(ctx, filter).Decode(&task)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return model.ReadingItem{}, fmt.Errorf("no quick tasks found : %v", err)
		} else {
			return model.ReadingItem{}, fmt.Errorf("failed to find the quick tasks")
		}
	}
	return task, nil

}

func ToggleQuickTasks(field string, status bool, id primitive.ObjectID, userId primitive.ObjectID) (bool, error) {
	tasksCollection, err := configuration.GetCollection("tasks")
	if err != nil {
		return false, fmt.Errorf("failed to get the tasks collection: %v", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	filter := bson.M{
		"_id":    id,
		"userId": userId,
	}

	update := bson.M{
		"$set": bson.M{
			field: !status,
		},
	}

	result, err := tasksCollection.UpdateOne(ctx, filter, update)

	if err != nil || result.ModifiedCount == 0 {
		return false, fmt.Errorf("failed to update tasks")
	}

	return true, nil

}

func DeleteQuickTasks(id primitive.ObjectID, userId primitive.ObjectID) (bool, error) {
	tasksCollection, err := configuration.GetCollection("tasks")
	if err != nil {
		return false, fmt.Errorf("failed to get the tasks collection: %v", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	filter := bson.M{
		"_id":    id,
		"userId": userId,
	}

	result, err := tasksCollection.DeleteOne(ctx, filter)

	if err != nil || result.DeletedCount == 0 {
		return false, fmt.Errorf("failed to delete tasks")
	}

	return true, nil

}
