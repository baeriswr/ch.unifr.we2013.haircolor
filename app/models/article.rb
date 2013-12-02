class Article < ActiveRecord::Base
  attr_accessible :image, :manufacturer, :name
  validates :manufacturer, presence: true
  validates :name, presence: true, length: { maximum: 50 }, uniqueness: { case_sensitive: false }
  
  searchable do
    text :name, :default_boost => 2
    text :manufacturer


    #boolean :featured
    #integer :blog_id
    #integer :author_id
    #integer :category_ids, :multiple => true
    #double  :average_rating
    #time    :published_at
    #time    :expired_at

    string  :sort_name do
      name.downcase.gsub(/^(an?|the)/, '')
    end
  end
  
end
