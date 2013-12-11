require 'formtastic'
class Quantity < ActiveRecord::Base
  belongs_to :article
  belongs_to :ingredient
  
end
