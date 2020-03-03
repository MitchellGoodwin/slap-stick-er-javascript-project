class UsersController < ApplicationController

    def create
        user = User.find_or_create_by(username: params[:username])
        if user.balance == nil
            user.balance = 0
            user.save
        end
        render json: user.to_json(:include => {:images => {:include => :purchases, :except => [:updated_at, :created_at]}}, :except => [:updated_at, :created_at])
    end

    def show
        user = User.find(params[:id])
        render json: user.to_json(:include => {:images => {:include => :purchases, :except => [:updated_at, :created_at]}}, :except => [:updated_at, :created_at])
    end

    def stickers
        user = User.find(params[:id])
        stickers = user.stickers
        render json: stickers.to_json(:include => {:user => {:only => :username}})
    end

    def update
        user = User.find(params[:id])
        user.balance = params[:balance]
        user.save
        render json: user.to_json
    end
end
