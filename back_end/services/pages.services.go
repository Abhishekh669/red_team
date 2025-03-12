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

func DeletePageWorkspace(id primitive.ObjectID, userId primitive.ObjectID) (bool, error) {
	pageCollection, err := configuration.GetCollection("pages")
	if err != nil {
		return false, fmt.Errorf("failed to get the pages collection: %v", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	filter := bson.M{
		"_id":    id,
		"userId": userId,
	}

	result, err := pageCollection.DeleteOne(ctx, filter)
	if err != nil {
		return false, fmt.Errorf("failed to delete page: %v", err)
	}

	if result.DeletedCount == 0 {
		return false, fmt.Errorf("no page found with the given ID")
	}

	return true, nil

}

func UpdatePageWorkspace(updateData model.UpdatePageWorkspace, userId primitive.ObjectID) (bool, error) {
	pageCollection, err := configuration.GetCollection("pages")
	if err != nil {
		return false, fmt.Errorf("failed to get the pages collection: %v", err)
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
		},
	}

	result, err := pageCollection.UpdateOne(ctx, filter, update)

	if err != nil || result.ModifiedCount == 0 {
		return false, fmt.Errorf("failed to update page")
	}

	return true, nil

}

func GetUserAllPages(userId primitive.ObjectID) ([]model.PageModel, error) {
	pageCollection, err := configuration.GetCollection("pages")
	if err != nil {
		return []model.PageModel{}, fmt.Errorf("failed to get the pages collection: %v", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	filter := bson.M{
		"userId": userId,
	}

	options := options.Find().SetSort(bson.M{"createdAt": -1})

	cursor, err := pageCollection.Find(ctx, filter, options)

	if err != nil {
		return []model.PageModel{}, fmt.Errorf("failed to get pages")
	}

	defer cursor.Close(ctx)

	var pageDatas []model.PageModel

	for cursor.Next(ctx) {
		var pageData model.PageModel

		if err := cursor.Decode(&pageData); err != nil {
			return []model.PageModel{}, fmt.Errorf("failed to decode pages")
		}
		pageDatas = append(pageDatas, pageData)
	}

	if err := cursor.Err(); err != nil {
		return []model.PageModel{}, fmt.Errorf("cursor error : %v", err)
	}
	return pageDatas, nil

}

func UpdatePageData(updateData model.UpdatePageData) (bool, error) {

	pageCollection, err := configuration.GetCollection("pages")
	if err != nil {
		return false, fmt.Errorf("failed to get the pages collection: %v", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	filter := bson.M{
		"_id":    updateData.ID,
		"userId": updateData.UserId,
	}

	update := bson.M{
		"$set": bson.M{
			"title":     updateData.Title,
			"content":   updateData.Content,
			"updatedAt": time.Now(),
		},
	}

	result, err := pageCollection.UpdateOne(ctx, filter, update)

	if err != nil || result.ModifiedCount == 0 {
		return false, fmt.Errorf("failed to update todo ")
	}

	return true, nil
}

func GetPageById(id primitive.ObjectID, userId primitive.ObjectID) (model.PageModel, error) {

	pageCollection, err := configuration.GetCollection("pages")
	if err != nil {
		return model.PageModel{}, fmt.Errorf("failed to get the pages collection: %v", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	filter := bson.M{
		"_id":    id,
		"userId": userId,
	}

	var pageData model.PageModel

	err = pageCollection.FindOne(ctx, filter).Decode(&pageData)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return model.PageModel{}, fmt.Errorf("no pages found : %v", err)
		} else {
			return model.PageModel{}, fmt.Errorf("failed to find the page")
		}
	}
	return pageData, nil

}

func CreateNewPage(pageData model.PageModel) (model.PageModel, error) {
	pageCollection, err := configuration.GetCollection("pages")
	if err != nil {
		return model.PageModel{}, fmt.Errorf("failed to get the pages collection: %v", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	result, err := pageCollection.InsertOne(ctx, pageData)

	if err != nil {
		return model.PageModel{}, fmt.Errorf("failed to create page: %v", err)
	}
	pageData.ID = result.InsertedID.(primitive.ObjectID)
	return pageData, nil

}
