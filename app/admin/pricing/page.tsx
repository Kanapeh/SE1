"use client";

import { useState } from 'react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  status: 'active' | 'inactive';
}

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  const handleAddPlan = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleEditPlan = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleDeletePlan = async (id: string) => {
    if (confirm('آیا از حذف این طرح قیمت‌گذاری اطمینان دارید؟')) {
      try {
        const response = await fetch(`/api/pricing/${id}`, { method: "DELETE" });
        if (response.ok) {
          setPlans(plans.filter((plan) => plan.id !== id));
        }
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(search.toLowerCase()) ||
      plan.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">مدیریت قیمت‌ها</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={handleAddPlan}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            افزودن طرح جدید
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-gray-600 mt-1">{plan.description}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    plan.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {plan.status === 'active' ? 'فعال' : 'غیرفعال'}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price.toLocaleString()}</span>
                <span className="text-gray-600"> تومان</span>
                <span className="text-gray-500 text-sm"> / {plan.duration}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 ml-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleEditPlan(plan)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {editingPlan ? 'ویرایش طرح قیمت‌گذاری' : 'افزودن طرح قیمت‌گذاری جدید'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">نام طرح</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={editingPlan?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">توضیحات</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  defaultValue={editingPlan?.description}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">قیمت (تومان)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue={editingPlan?.price}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">مدت زمان</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue={editingPlan?.duration}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ویژگی‌ها</label>
                <div className="mt-2 space-y-2">
                  {(editingPlan?.features || ['']).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={feature}
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          // Remove feature
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // Add new feature
                    }}
                  >
                    + افزودن ویژگی
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">وضعیت</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={editingPlan?.status}
                >
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingPlan ? 'ذخیره تغییرات' : 'افزودن طرح'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 