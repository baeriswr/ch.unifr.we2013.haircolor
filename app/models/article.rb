class Article < ActiveRecord::Base
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
