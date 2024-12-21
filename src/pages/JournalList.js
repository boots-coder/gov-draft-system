import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JournalList = () => {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 默认数据
    const defaultJournals = [
        {
            id: 1,
            title: '默认期刊 1',
            topic: '默认主题 1',
            deadline: '2024-01-15',
            status: '征稿中',
        },
        {
            id: 2,
            title: '默认期刊 2',
            topic: '默认主题 2',
            deadline: '2024-02-01',
            status: '已截止',
        },
    ];

    useEffect(() => {
        const fetchJournals = async () => {
            try {
                // 尝试从后端获取数据
                const response = await axios.get('http://localhost:8080/api/journals');
                setJournals(response.data);
            } catch (err) {
                // 捕获错误，显示默认数据
                console.error('API 请求失败，使用默认数据:', err);
                setError('无法获取数据，显示默认内容。');
                setJournals(defaultJournals);
            } finally {
                setLoading(false);
            }
        };

        fetchJournals();
    }, []);

    if (loading) return <p>加载中...</p>;
    if (error) console.warn(error);

    return (
        <div className="content">
            <h1>约稿列表</h1>
            <div className="journal-list">
                {journals.length > 0 ? (
                    journals.map((journal) => (
                        <div key={journal.id} className="journal-card">
                            <h2>{journal.title}</h2>
                            <p>主题: {journal.topic}</p>
                            <p>截止日期: {journal.deadline}</p>
                            <p>状态: {journal.status}</p>
                        </div>
                    ))
                ) : (
                    <p>没有找到任何约稿。</p>
                )}
            </div>
        </div>
    );
};

export default JournalList;