class FollowsController < ApplicationController

    def create
        follow = Follow.new(follow_params)
        follow.save
        message = {message: "#{follow.follower.username} has just followed you!", type: 'New Follower'}
        NotificationChannel.broadcast_to(follow.artist, message)
        render json: follow.to_json
    end

    def destroy
        follow = Follow.find(params[:id])
        render json: follow.destroy().to_json
    end

    private

    def follow_params
        params.require(:follow).permit(:follower_id, :artist_id)
    end
end
