class ImagesController < ApplicationController

    def index
        images = Image.all 
        render json: images.to_json(:include => {:user => {:include => :following_users}})
    end

    def create
        image = Image.new()
        image.imgdata = params[:imgdata]
        image.user_id = params[:user_id]
        image.for_sale = false
        image.cost = 0
        image.title = "untitled"
        image.save
        render json: image.to_json
    end

    def show
        image = Image.find(params[:id])
        render json: image.to_json
    end

    def update
        image = Image.find(params[:id])
        image.update(params.require(:image).permit(:imgdata, :cost, :title, :for_sale))
        if params[:for_sale]
            message = {message: "#{image.user.username} has just put their new sticker #{image.title} up for sale!", type: 'Artist Update'}
            image.user.followers.each{|follower| NotificationChannel.broadcast_to(follower, message)}
        end
        render json: image.to_json
    end

    def destroy
        image = Image.find(params[:id])
        render json: image.destroy().to_json
    end
end
