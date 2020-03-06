class PurchasesController < ApplicationController

    def create
        purchases = []
        params[:amount].times do
            purchase = Purchase.create(user_id: params[:user_id], image_id: params[:image_id])
            purchases << purchase
        end
        image = Image.find(params[:image_id])
        seller = image.user
        buyer = User.find(params[:user_id])
        cost = image.cost * params[:amount]
        buyer.balance = buyer.balance - cost
        balance = "#{seller.balance + cost}"
        message = {message: "#{buyer.username} bought your #{image.title} #{params[:amount]} times for a total of $#{cost}.", balance: balance, type: 'New Purchase'}
        NotificationChannel.broadcast_to(seller, message)
        render json: purchases.to_json(:include => {:image => {:include => :user, :only => [:id, :balance, :cost]}, :user => {:only => :balance}})
    end
end
