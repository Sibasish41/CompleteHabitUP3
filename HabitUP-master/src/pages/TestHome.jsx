import React from 'react'

const TestHome = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">HabitUP</h1>
        <p className="text-xl text-gray-600 mb-8">Homepage is working!</p>
        <div className="space-y-4">
          <p className="text-gray-500">✅ React is working</p>
          <p className="text-gray-500">✅ Routing is working</p>
          <p className="text-gray-500">✅ Components are loading</p>
        </div>
      </div>
    </div>
  )
}

export default TestHome