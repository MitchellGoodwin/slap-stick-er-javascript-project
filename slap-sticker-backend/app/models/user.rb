class User < ApplicationRecord
    has_many :images
    has_many :purchases

    def stickers
        stickers = self.purchases.map{|purchase| purchase.image}
        stickers = stickers.map{|sticker| {sticker: sticker, amount: sticker.purchases.select{|purchase| purchase.user_id == self.id}.length}}
        return stickers.uniq
    end
end
