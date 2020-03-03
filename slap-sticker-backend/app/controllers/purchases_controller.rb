class PurchasesController < ApplicationController

    def create
        purchases = []
        params[:amount].times do
            purchase = Purchase.create(user_id: params[:user_id], image_id: params[:image_id])
            purchases << purchase
        end
        render json: purchases.to_json(:include => {:image => {:include => :user, :only => [:id, :balance, :cost]}, :user => {:only => :balance}})
    end
end
