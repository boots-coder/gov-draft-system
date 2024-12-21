import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import '../styles/home.css';

const Home = () => {
    const navigate = useNavigate();
    const [recentDrafts, setRecentDrafts] = useState([]);
    const [statistics, setStatistics] = useState({
        totalDrafts: 0,
        activeDrafts: 0,
        completedDrafts: 0,
        averageBudget: 0
    });
    const [loading, setLoading] = useState(true);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [budgetTrend, setBudgetTrend] = useState([]);

    // 模拟数据
    const mockRecentDrafts = [
        {
            id: 1,
            title: '数字化转型政策研究',
            category: '政策研究',
            deadline: '2024-12-31',
            budget: 5000,
            status: 'open',
        },
        {
            id: 2,
            title: '乡村振兴战略实施效果评估',
            category: '调研报告',
            deadline: '2024-11-30',
            budget: 8000,
            status: 'in_progress',
        },
        {
            id: 3,
            title: '智慧城市建设研究报告',
            category: '研究报告',
            deadline: '2024-12-15',
            budget: 6000,
            status: 'open',
        }
    ];

    const mockStatistics = {
        totalDrafts: 156,
        activeDrafts: 45,
        completedDrafts: 98,
        averageBudget: 6500
    };

    // 模拟月度统计数据
    const mockMonthlyStats = [
        { month: '1月', drafts: 12, completed: 8 },
        { month: '2月', drafts: 15, completed: 10 },
        { month: '3月', drafts: 18, completed: 12 },
        { month: '4月', drafts: 20, completed: 15 },
        { month: '5月', drafts: 25, completed: 18 },
        { month: '6月', drafts: 30, completed: 22 },
    ];

    // 模拟分类统计数据
    const mockCategoryStats = [
        { name: '政策研究', value: 35 },
        { name: '调研报告', value: 25 },
        { name: '学术论文', value: 20 },
        { name: '研究综述', value: 15 },
        { name: '其他', value: 5 },
    ];

    // 模拟预算趋势数据
    const mockBudgetTrend = [
        { month: '1月', average: 5000 },
        { month: '2月', average: 5500 },
        { month: '3月', average: 6000 },
        { month: '4月', average: 6200 },
        { month: '5月', average: 6800 },
        { month: '6月', average: 7000 },
    ];

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setRecentDrafts(mockRecentDrafts);
            setStatistics(mockStatistics);
            setMonthlyStats(mockMonthlyStats);
            setCategoryStats(mockCategoryStats);
            setBudgetTrend(mockBudgetTrend);
        } catch (error) {
            console.error('获取首页数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            open: '招稿中',
            in_progress: '进行中',
            completed: '已完成',
            cancelled: '已取消'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const classMap = {
            open: 'status-open',
            in_progress: 'status-progress',
            completed: 'status-completed',
            cancelled: 'status-cancelled'
        };
        return classMap[status] || '';
    };

    // 饼图颜色
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="home-container">
            {/* 欢迎区域 */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <h1>欢迎使用稿件管理系统</h1>
                    <p>高效的稿件管理平台，助力政策研究和学术写作</p>
                    {localStorage.getItem('userRole') === 'author' && (
                        <button
                            className="btn-primary"
                            onClick={() => navigate('/drafts')}
                        >
                            浏览约稿
                        </button>
                    )}
                    {localStorage.getItem('userRole') === 'editor' && (
                        <button
                            className="btn-primary"
                            onClick={() => navigate('/drafts/create')}
                        >
                            发布约稿
                        </button>
                    )}
                </div>
            </div>

            {/* 统计数据 */}
            <div className="statistics-section">
                <div className="stat-card">
                    <div className="stat-value">{statistics.totalDrafts}</div>
                    <div className="stat-label">总稿件数</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{statistics.activeDrafts}</div>
                    <div className="stat-label">进行中</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{statistics.completedDrafts}</div>
                    <div className="stat-label">已完成</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">¥{statistics.averageBudget}</div>
                    <div className="stat-label">平均预算</div>
                </div>
            </div>

            {/* 数据可视化区域 */}
            <div className="data-visualization-section">
                {/* 月度统计图表 */}
                <div className="chart-container">
                    <h3>月度稿件统计</h3>
                    {loading ? (
                        <div className="chart-loading">加载中...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="drafts" name="总稿件" fill="#1890ff" />
                                <Bar dataKey="completed" name="已完成" fill="#52c41a" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* 分类统计饼图 */}
                <div className="chart-container">
                    <h3>稿件类别分布</h3>
                    {loading ? (
                        <div className="chart-loading">加载中...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* 预算趋势图 */}
                <div className="chart-container">
                    <h3>平均预算趋势</h3>
                    {loading ? (
                        <div className="chart-loading">加载中...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={budgetTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="average"
                                    name="平均预算"
                                    stroke="#1890ff"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* 最新约稿 */}
            <div className="recent-drafts-section">
                <div className="section-header">
                    <h2>最新约稿</h2>
                    <button
                        className="btn-more"
                        onClick={() => navigate('/drafts')}
                    >
                        查看更多
                    </button>
                </div>

                <div className="drafts-grid">
                    {loading ? (
                        <div className="loading">加载中...</div>
                    ) : (
                        recentDrafts.map(draft => (
                            <div
                                key={draft.id}
                                className="draft-card"
                                onClick={() => navigate(`/drafts/${draft.id}`)}
                            >
                                <div className="draft-card-header">
                                    <h3>{draft.title}</h3>
                                    <span className={`status-badge ${getStatusClass(draft.status)}`}>
                    {getStatusText(draft.status)}
                  </span>
                                </div>
                                <div className="draft-card-content">
                                    <div className="draft-info-item">
                                        <span className="label">类别：</span>
                                        <span>{draft.category}</span>
                                    </div>
                                    <div className="draft-info-item">
                                        <span className="label">截止日期：</span>
                                        <span>{draft.deadline}</span>
                                    </div>
                                    <div className="draft-info-item">
                                        <span className="label">预算：</span>
                                        <span>¥{draft.budget}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 快速入口 */}
            <div className="quick-access-section">
                <div className="section-header">
                    <h2>快速入口</h2>
                </div>
                <div className="quick-access-grid">
                    <div className="quick-access-card" onClick={() => navigate('/manuscripts')}>
                        <i className="icon-manuscript"></i>
                        <span>我的稿件</span>
                    </div>
                    <div className="quick-access-card" onClick={() => navigate('/drafts')}>
                        <i className="icon-browse"></i>
                        <span>浏览约稿</span>
                    </div>
                    <div className="quick-access-card" onClick={() => navigate('/profile')}>
                        <i className="icon-profile"></i>
                        <span>个人中心</span>
                    </div>
                    <div className="quick-access-card" onClick={() => navigate('/help')}>
                        <i className="icon-help"></i>
                        <span>帮助中心</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;