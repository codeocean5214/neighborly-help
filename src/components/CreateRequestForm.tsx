import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, AlertCircle, DollarSign } from 'lucide-react';
import { Category } from '../types';
import { categories } from '../data/mockData';

interface CreateRequestFormProps {
  onSubmit: (requestData: any) => void;
  onCancel: () => void;
}

const CreateRequestForm: React.FC<CreateRequestFormProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as Category | '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    location: '',
    paymentType: 'free' as 'free' | 'paid' | 'donation',
    suggestedAmount: 0,
    currency: 'USD'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'open',
      offers: []
    });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.category && formData.urgency;
      case 2:
        return formData.title.trim() && formData.description.trim() && formData.description.length <= 500;
      case 3:
        return formData.location.trim();
      case 4:
        return formData.paymentType && (formData.paymentType === 'free' || formData.suggestedAmount > 0);
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Post a Help Request</h2>
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-4 mb-2">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  num <= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {num}
              </div>
              {num < 4 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    num < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Category</span>
          <span>Details</span>
          <span>Location</span>
          <span>Payment</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Category and Urgency */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What type of help do you need?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: category.value })}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      formData.category === category.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{category.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How urgent is this request?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low', label: 'Low Priority', desc: 'Can wait a few days' },
                  { value: 'medium', label: 'Medium Priority', desc: 'Needed within 1-2 days' },
                  { value: 'high', label: 'High Priority', desc: 'Needed today/tomorrow' }
                ].map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: priority.value as any })}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      formData.urgency === priority.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm">{priority.label}</div>
                    <div className="text-xs text-gray-600 mt-1">{priority.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Title and Description */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Request Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Need help with grocery shopping"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please provide more details about what help you need..."
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  {formData.description.length}/500 characters
                </span>
                {formData.description.length > 450 && (
                  <div className="flex items-center space-x-1 text-orange-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Character limit approaching</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </div>
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 123 Main Street or Downtown area"
              />
              <p className="text-sm text-gray-600 mt-2">
                This helps potential helpers understand where assistance is needed. You can be as specific or general as you're comfortable with.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Payment Options */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Type
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="free"
                    checked={formData.paymentType === 'free'}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Free Help</div>
                    <div className="text-sm text-gray-600">Community assistance at no cost</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="paid"
                    checked={formData.paymentType === 'paid'}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Paid Service</div>
                    <div className="text-sm text-gray-600">Professional service with payment</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="donation"
                    checked={formData.paymentType === 'donation'}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Optional Donation</div>
                    <div className="text-sm text-gray-600">Free help with optional tip/donation</div>
                  </div>
                </label>
              </div>
            </div>

            {(formData.paymentType === 'paid' || formData.paymentType === 'donation') && (
              <div>
                <label htmlFor="suggestedAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.paymentType === 'paid' ? 'Service Fee' : 'Suggested Donation Amount'}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    id="suggestedAmount"
                    value={formData.suggestedAmount}
                    onChange={(e) => setFormData({ ...formData, suggestedAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {formData.paymentType === 'paid' 
                    ? 'Set a fair price for your requested service'
                    : 'Suggest an amount, but helpers can choose their own donation'
                  }
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Request Summary</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Category:</span> {formData.category}</div>
                <div><span className="font-medium">Priority:</span> {formData.urgency}</div>
                <div><span className="font-medium">Title:</span> {formData.title}</div>
                <div><span className="font-medium">Location:</span> {formData.location}</div>
                <div><span className="font-medium">Payment:</span> {
                  formData.paymentType === 'free' ? 'Free' :
                  formData.paymentType === 'paid' ? `$${formData.suggestedAmount.toFixed(2)}` :
                  `Optional donation (suggested: $${formData.suggestedAmount.toFixed(2)})`
                }</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isStepValid()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Post Request
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateRequestForm;