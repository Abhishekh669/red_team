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

func TodoBulkUpdate(tasks []model.TodoBulkUpdate, userId primitive.ObjectID) (bool, error) {
	todoCollection, err := configuration.GetCollection("todos")

	if err != nil {
		return false, fmt.Errorf("failed to get todo collection")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var updates []mongo.WriteModel

	for _, task := range tasks {
		update := mongo.NewUpdateOneModel().
			SetFilter(bson.M{"_id": task.ID, "userId": userId}).
			SetUpdate(bson.M{
				"$set": bson.M{
					"state":    task.State,
					"position": task.Position,
				},
			})
		updates = append(updates, update)
	}

	bulkWriteOptions := options.BulkWrite().SetOrdered(true)
	results, err := todoCollection.BulkWrite(ctx, updates, bulkWriteOptions)

	if err != nil {
		return false, fmt.Errorf("failed to update ")
	}

	if results.MatchedCount == 0 {
		return false, fmt.Errorf("no matching documents found for update")
	}

	return true, nil

}

func UpdateTodo(updateData model.TodoUpdateDbRequest, userId primitive.ObjectID) (bool, error) {
	todoCollection, err := configuration.GetCollection("todos")

	if err != nil {
		return false, fmt.Errorf("failed to get todo collection")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"_id":    updateData.ID,
		"userId": userId,
	}

	update := bson.M{
		"$set": bson.M{
			"title":       updateData.Title,
			"description": updateData.Description,
			"state":       updateData.State,
			"tag":         updateData.Tag,
		},
	}

	result, err := todoCollection.UpdateOne(ctx, filter, update)

	if err != nil || result.ModifiedCount == 0 {
		return false, fmt.Errorf("failed to update todo ")
	}

	return true, nil

}

func DeleteTodo(todoId primitive.ObjectID, userId primitive.ObjectID) (bool, error) {
	todoCollection, err := configuration.GetCollection("todos")

	if err != nil {
		return false, fmt.Errorf("failed to get todo collection")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"_id":    todoId,
		"userId": userId,
	}

	result, err := todoCollection.DeleteOne(ctx, filter)
	if err != nil {
		return false, fmt.Errorf("failed to delete todo: %v", err)
	}

	if result.DeletedCount == 0 {
		return false, fmt.Errorf("no todo found with the given ID")
	}

	return true, nil

}

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
