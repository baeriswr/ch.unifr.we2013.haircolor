#require 'formtastic'
class Quantity < ActiveRecord::Base
  belongs_to :article
  belongs_to :ingredient

  accepts_nested_attributes_for :ingredient
end
