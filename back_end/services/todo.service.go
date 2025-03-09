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
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetTodoById(todoId primitive.ObjectID) (model.Todo, error) {
	todoCollection, err := configuration.GetCollection("todos")

	if err != nil {
		return model.Todo{}, fmt.Errorf("failed to get todo collection")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"_id": todoId,
	}

	var todo model.Todo

	err = todoCollection.FindOne(ctx, filter).Decode(&todo)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return model.Todo{}, fmt.Errorf("no todo found : %v", err)
		} else {
			return model.Todo{}, fmt.Errorf("failed to find the todo")
		}
	}
	return todo, nil

}

func GetAllUserTodos(userId primitive.ObjectID) ([]model.Todo, error) {
	todoCollection, err := configuration.GetCollection("todos")

	if err != nil {
		return []model.Todo{}, fmt.Errorf("failed to get todo collection")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"userId": userId,
	}

	cursor, err := todoCollection.Find(ctx, filter)

	if err != nil {
		return []model.Todo{}, fmt.Errorf("failed to get todos")
	}

	defer cursor.Close(ctx)

	var todos []model.Todo

	for cursor.Next(ctx) {
		var todo model.Todo

		if err := cursor.Decode(&todo); err != nil {
			return []model.Todo{}, fmt.Errorf("failed to decode todos")
		}
		todos = append(todos, todo)
	}

	if err := cursor.Err(); err != nil {
		return []model.Todo{}, fmt.Errorf("cursor error : %v", err)
	}
	return todos, nil
}

func CreateTodo(todoData model.Todo) (bool, error) {
	todoCollection, err := configuration.GetCollection("todos")

	if err != nil {
		return false, fmt.Errorf("failed to get todo collection")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	insertedID, err := todoCollection.InsertOne(ctx, todoData)

	if err != nil || insertedID.InsertedID.(primitive.ObjectID).IsZero() {
		return false, fmt.Errorf("failed to create todo: %v", err)
	}

	return true, nil

}

func GetHighestPosition(state model.State, userId primitive.ObjectID) (int64, error) {
	todoCollection, err := configuration.GetCollection("todos")

	if err != nil {
		return 1000, fmt.Errorf("failed to get todo collection")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"state":  state,
		"userId": userId,
	}

	sortOptions := options.FindOne().SetSort(bson.D{{Key: "position", Value: -1}})

	var highestPositionTask model.Todo
	err = todoCollection.FindOne(ctx, filter, sortOptions).Decode(&highestPositionTask)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			fmt.Println("No documents found")
			return 1000, nil
		}
		return 1000, fmt.Errorf("failed to get data")
	}
	newPosition := int64(highestPositionTask.Position) + 1000
	fmt.Println("i am here", newPosition)
	return newPosition, nil

}
