"use client";

import React, { useState } from 'react';
import { TrendingUp, BookOpen, Award, Trophy, Star, Lock, CheckCircle, PlayCircle, FileText, Brain, Target, Zap, Sparkles, LogOut , User } from 'lucide-react';
import Link from 'next/link';

export default function LearningPage() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [userPoints, setUserPoints] = useState(450);
  const [userLevel, setUserLevel] = useState(3);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  const learningModules = [
    {
      id: 1,
      title: 'Stock Market Basics',
      description: 'Learn the fundamentals of stock trading',
      lessons: 8,
      duration: '2 hours',
      points: 100,
      status: 'completed',
      progress: 100,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      unlocked: true
    },
    {
      id: 2,
      title: 'Technical Analysis',
      description: 'Master chart patterns and indicators',
      lessons: 12,
      duration: '3 hours',
      points: 150,
      status: 'in-progress',
      progress: 60,
      icon: Brain,
      color: 'from-green-500 to-green-600',
      unlocked: true
    },
    {
      id: 3,
      title: 'Portfolio Management',
      description: 'Build and manage a diversified portfolio',
      lessons: 10,
      duration: '2.5 hours',
      points: 200,
      status: 'in-progress',
      progress: 30,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      unlocked: true
    },
    {
      id: 4,
      title: 'Options Trading',
      description: 'Advanced strategies with options',
      lessons: 15,
      duration: '4 hours',
      points: 250,
      status: 'locked',
      progress: 0,
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      unlocked: false
    },
    {
      id: 5,
      title: 'Risk Management',
      description: 'Protect your investments',
      lessons: 8,
      duration: '2 hours',
      points: 150,
      status: 'locked',
      progress: 0,
      icon: Award,
      color: 'from-red-500 to-red-600',
      unlocked: false
    },
    {
      id: 6,
      title: 'Market Psychology',
      description: 'Understanding market behavior',
      lessons: 10,
      duration: '2.5 hours',
      points: 200,
      status: 'locked',
      progress: 0,
      icon: Brain,
      color: 'from-pink-500 to-pink-600',
      unlocked: false
    }
  ];

  const achievements = [
    { title: 'First Steps', description: 'Complete your first lesson', points: 50, earned: true, icon: Star },
    { title: 'Quiz Master', description: 'Score 100% on 5 quizzes', points: 100, earned: true, icon: Trophy },
    { title: 'Fast Learner', description: 'Complete a module in one day', points: 75, earned: true, icon: Zap },
    { title: 'Dedicated Student', description: 'Study for 7 days straight', points: 150, earned: false, icon: Target },
    { title: 'Expert Trader', description: 'Complete all modules', points: 500, earned: false, icon: Award }
  ];

  const recentActivity = [
    { type: 'lesson', title: 'Understanding Bull Markets', points: 25, time: '2 hours ago' },
    { type: 'quiz', title: 'Technical Analysis Quiz', points: 50, time: '5 hours ago' },
    { type: 'achievement', title: 'Earned "Quiz Master" badge', points: 100, time: '1 day ago' }
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Chen', points: 1250, avatar: 'SC' },
    { rank: 2, name: 'Mike Johnson', points: 980, avatar: 'MJ' },
    { rank: 3, name: 'You', points: 450, avatar: 'JD', isUser: true },
    { rank: 4, name: 'Emily Davis', points: 420, avatar: 'ED' },
    { rank: 5, name: 'Alex Kumar', points: 380, avatar: 'AK' }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl animate-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }} />
        <div className="absolute w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl animate-float" style={{ bottom: '10%', right: '10%', animationDelay: '2s' }} />
        <div className="absolute w-64 h-64 bg-pink-300 rounded-full opacity-20 blur-3xl animate-float" style={{ top: '50%', left: '50%', animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="bg-white bg-opacity-80 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 hover:opacity-90 cursor-pointer">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-semibold text-gray-800">AlphaWave</span>
            </div>
            <div className="flex items-center space-x-4">
                            <Link href="/stocks"><button className="text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-110 text-sm">Stocks</button></Link>
              <Link href="/invest"><button className="text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-110 text-sm">Portfolio</button></Link>
              <Link href="/learn"><button className="text-blue-500 font-medium hover:scale-110 transition-transform duration-300 text-sm">Learn</button></Link>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-110 text-sm font-medium">
                <LogOut/>
              </button>
              <Link href="/profile"><div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium transform hover:scale-110 transition-all duration-300 cursor-pointer text-xs">
                <User />
              </div></Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
        {/* Header */}
        <div className="mb-4 animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
            Learning Center
            <Sparkles className="ml-2 w-5 h-5 text-yellow-500 animate-pulse" />
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-all duration-500 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white text-opacity-80">Total Points</p>
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold">{userPoints}</h3>
            <p className="text-xs text-white text-opacity-90">Level {userLevel}</p>
          </div>

          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-all duration-500 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white text-opacity-80">Completed</p>
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold">1/6</h3>
            <p className="text-xs text-white text-opacity-90">Modules</p>
          </div>

          <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-all duration-500 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white text-opacity-80">Achievements</p>
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold">3/5</h3>
            <p className="text-xs text-white text-opacity-90">Unlocked</p>
          </div>

          <div className="bg-linear-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-all duration-500 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white text-opacity-80">Leaderboard</p>
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold">#3</h3>
            <p className="text-xs text-white text-opacity-90">Your Rank</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Learning Roadmap */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl border border-blue-100 shadow-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="p-4 border-b border-blue-100">
                <h2 className="text-lg font-bold text-gray-900">Learning Roadmap</h2>
              </div>
              <div className="p-4 space-y-3">
                {learningModules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <div
                      key={module.id}
                      className={`relative bg-white rounded-lg border-2 ${
                        module.unlocked ? 'border-blue-200 hover:border-blue-400 cursor-pointer' : 'border-gray-200'
                      } p-4 transition-all duration-300 ${module.unlocked ? 'hover:shadow-lg' : 'opacity-60'}`}
                      onClick={() => module.unlocked && setSelectedModule(module)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`w-12 h-12 bg-linear-to-br ${module.color} rounded-lg flex items-center justify-center shrink-0 shadow-lg`}>
                            {module.unlocked ? (
                              <Icon className="w-6 h-6 text-white" />
                            ) : (
                              <Lock className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-sm">{module.title}</h3>
                              {module.status === 'completed' && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{module.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-600">
                              <span className="flex items-center">
                                <FileText className="w-3 h-3 mr-1" />
                                {module.lessons} lessons
                              </span>
                              <span className="flex items-center">
                                <PlayCircle className="w-3 h-3 mr-1" />
                                {module.duration}
                              </span>
                              <span className="flex items-center text-yellow-600 font-medium">
                                <Trophy className="w-3 h-3 mr-1" />
                                {module.points} pts
                              </span>
                            </div>
                            {module.unlocked && module.progress > 0 && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-600">Progress</span>
                                  <span className="text-xs font-semibold text-blue-600">{module.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`bg-linear-to-r ${module.color} h-1.5 rounded-full transition-all duration-500`}
                                    style={{ width: `${module.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {!module.unlocked && (
                        <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded-full">
                          Locked
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl border border-blue-100 shadow-lg animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="p-4 border-b border-blue-100">
                <h2 className="text-lg font-bold text-gray-900">Achievements</h2>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 ${
                        achievement.earned
                          ? 'border-yellow-300 bg-yellow-50'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      } transition-all duration-300`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          achievement.earned ? 'bg-yellow-400' : 'bg-gray-300'
                        }`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-gray-900">{achievement.title}</h4>
                          <p className="text-xs text-gray-600 mb-1">{achievement.description}</p>
                          <span className="text-xs font-semibold text-yellow-600">+{achievement.points} points</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Leaderboard */}
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl border border-blue-100 shadow-lg animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="p-4 border-b border-blue-100">
                <h2 className="text-lg font-bold text-gray-900">Leaderboard</h2>
              </div>
              <div className="divide-y divide-blue-100">
                {leaderboard.map((user, index) => (
                  <div
                    key={index}
                    className={`p-3 ${user.isUser ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          user.rank === 1 ? 'bg-yellow-400 text-white' :
                          user.rank === 2 ? 'bg-gray-300 text-white' :
                          user.rank === 3 ? 'bg-orange-400 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {user.rank}
                        </div>
                        <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {user.avatar}
                        </div>
                        <span className={`text-sm ${user.isUser ? 'font-bold text-blue-600' : 'text-gray-900'}`}>
                          {user.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{user.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl border border-blue-100 shadow-lg animate-fade-in" style={{ animationDelay: '700ms' }}>
              <div className="p-4 border-b border-blue-100">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-blue-100">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50 transition-colors duration-300">
                    <div className="flex items-start space-x-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        activity.type === 'lesson' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'quiz' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'lesson' ? <BookOpen className="w-4 h-4" /> :
                         activity.type === 'quiz' ? <CheckCircle className="w-4 h-4" /> :
                         <Trophy className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-yellow-600 font-semibold">+{activity.points} pts</span>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Milestone */}
            <div className="bg-linear-to-br from-purple-100 via-pink-100 to-blue-100 rounded-xl p-4 border border-purple-200 shadow-lg animate-fade-in" style={{ animationDelay: '800ms' }}>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Next Milestone</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Level 4</span>
                  <span className="text-xs font-semibold text-purple-600">{userPoints}/500 pts</span>
                </div>
                <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(userPoints / 500) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">50 points until next level!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.05); }
          50% { transform: translate(-15px, 15px) scale(0.95); }
          75% { transform: translate(15px, 20px) scale(1.02); }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}