import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../styles/home.css';
import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState({
        totalArticles: 0,
        pending: 0,
        approved: 0,
        published: 0,
        rejected: 0,
    });
    const [statusDistribution, setStatusDistribution] = useState([]);
    const [averageWordCount, setAverageWordCount] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activePopup, setActivePopup] = useState(null); // 控制弹出框显示

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8081/api/article/page?current=1&size=1000');
            if (response.data.code === 200) {
                const records = response.data.data.records;

                // 按状态统计文章数量
                const stats = {
                    totalArticles: records.length,
                    pending: records.filter(article => article.status === '待审核').length,
                    approved: records.filter(article => article.status === '采纳').length,
                    published: records.filter(article => article.status === '已发布').length,
                    rejected: records.filter(article => article.status === '拒绝').length,
                };

                // 状态分布饼图数据
                const distribution = [
                    { name: '待审核', value: stats.pending },
                    { name: '采纳', value: stats.approved },
                    { name: '已发布', value: stats.published },
                    { name: '拒绝', value: stats.rejected },
                ];

                // 计算近十天平均字数趋势
                const wordCountTrend = calculateAverageWordCount(records);

                setStatistics(stats);
                setStatusDistribution(distribution);
                setAverageWordCount(wordCountTrend);
            }
        } catch (error) {
            console.error('获取统计数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAverageWordCount = (records) => {
        const wordCountByDate = {};

        // 按提交日期统计字数
        records.forEach((record) => {
            const date = new Date(record.submittedAt).toISOString().split('T')[0]; // 提交日期
            const wordCount = record.content ? record.content.length : 0;
            if (!wordCountByDate[date]) {
                wordCountByDate[date] = { totalWords: 0, count: 0 };
            }
            wordCountByDate[date].totalWords += wordCount;
            wordCountByDate[date].count += 1;
        });

        // 计算每日期的平均字数
        const sortedDates = Object.keys(wordCountByDate).sort().slice(-10); // 仅保留最近十天
        return sortedDates.map(date => ({
            date,
            average: Math.round(wordCountByDate[date].totalWords / wordCountByDate[date].count),
        }));
    };

    const isAdmin = localStorage.getItem('userRole') === 'admin';

    // 饼图颜色
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="home-container">
            {/* 欢迎区域 */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <h1>欢迎使用稿件管理系统</h1>
                    <p>高效的稿件管理平台，助力政策研究和学术写作</p>
                    {isAdmin && (
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
                {loading ? (
                    <div>加载中...</div>
                ) : (
                    <>
                        <div className="stat-card">
                            <div className="stat-value">{statistics.totalArticles}</div>
                            <div className="stat-label">文章总数</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{statistics.pending}</div>
                            <div className="stat-label">审核中</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{statistics.approved}</div>
                            <div className="stat-label">采纳</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{statistics.published}</div>
                            <div className="stat-label">已发布</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{statistics.rejected}</div>
                            <div className="stat-label">拒绝</div>
                        </div>
                    </>
                )}
            </div>

            {/* 数据可视化区域 */}
            <div className="data-visualization-section">
                {/* 稿件状态分布饼图 */}
                <div className="chart-container">
                    <h3>稿件状态分布</h3>
                    {loading ? (
                        <div className="chart-loading">加载中...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884D8"
                                    dataKey="value"
                                >
                                    {statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* 文章平均字数趋势 */}
                <div className="chart-container">
                    <h3>近十天文章平均字数趋势</h3>
                    {loading ? (
                        <div className="chart-loading">加载中...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={averageWordCount}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="average"
                                    name="平均字数"
                                    stroke="#1890FF"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* 快速入口 */}
            <div className="quick-access-section">
                <div className="section-header">
                    <h2>快速入口</h2>
                </div>
                <div className="quick-access-grid">
                    <div className="quick-access-card" onClick={() => navigate('/drafts')}>
                        <i className="icon-draft-list"></i>
                        <span>约稿列表</span>
                    </div>
                    <div className="quick-access-card" onClick={() => setActivePopup('help')}>
                        <i className="icon-help"></i>
                        <span>帮助中心</span>
                    </div>
                    <div className="quick-access-card" onClick={() => setActivePopup('usage')}>
                        <i className="icon-usage"></i>
                        <span>系统使用指南</span>
                    </div>
                    <div className="quick-access-card" onClick={() => setActivePopup('faq')}>
                        <i className="icon-faq"></i>
                        <span>常见问题</span>
                    </div>
                </div>
            </div>

            {/* 显示的内容框 */}
            {activePopup && (
                <div className="popup-overlay" onClick={() => setActivePopup(null)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        {activePopup === 'help' && (
                            <div>
                                <h3>帮助中心</h3>
                                <p>如果需要帮助，请联系管理员：</p>
                                <p>固定电话：99999</p>
                            </div>
                        )}
                        {activePopup === 'usage' && (
                            <div>
                                <h3>系统使用指南</h3>
                                <p>1. 登录后可根据角色进入相应功能模块。</p>
                                <p>2. 管理员可发布约稿，查看稿件状态。</p>
                                <p>3. 作者可提交稿件并跟踪进展。</p>
                            </div>
                        )}
                        {activePopup === 'faq' && (
                            <div>
                                <h3>常见问题</h3>
                                <p>Q: 如何提交稿件？</p>
                                <p>A: 登录后点击“我的稿件”，然后点击“提交新稿件”。</p>
                                <p>Q: 联系方式有问题怎么办？</p>
                                <p>A: 请拨打管理员电话：99999。</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;