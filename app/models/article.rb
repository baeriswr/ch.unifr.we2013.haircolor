class Article < ActiveRecord::Base
  validates :manufacturer, presence: true
  validates :name, presence: true, length: { maximum: 50 }, uniqueness: { case_sensitive: false }
  
  has_many :quantities
  has_many :ingredients, through: :quantities
  
  #searchable do
  #  string :name
  #  string :manufacturer
  #  time    :created_at
  #  time    :updated_at

  #  string  :sort_name do
  #    name.downcase.gsub(/^(an?|the)/, '')
  #  end
  #end
  
end
