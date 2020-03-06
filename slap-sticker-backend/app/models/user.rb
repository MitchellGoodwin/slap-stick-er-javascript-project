class User < ApplicationRecord
    has_many :images
    has_many :purchases

    has_many :followed_users, foreign_key: :follower_id, class_name: 'Follow'
    has_many :artists, through: :followed_users

    has_many :following_users, foreign_key: :artist_id, class_name: 'Follow'
    has_many :followers, through: :following_users

    def stickers
        stickers = self.purchases.map{|purchase| purchase.image}
        stickers = stickers.map{|sticker| {sticker: sticker, amount: sticker.purchases.select{|purchase| purchase.user_id == self.id}.length}}
        return stickers.uniq
    end
end
