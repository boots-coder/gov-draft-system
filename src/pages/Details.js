import React from 'react';
import { useParams } from 'react-router-dom';

const Details = ({ journals }) => {
    const { id } = useParams();
    const journal = journals.find(journal => journal.id === parseInt(id));

    if (!journal) {
        return <p>未找到该期刊信息</p>;
    }

    return (
        <div>
            <h1>{journal.title}</h1>
            <p>主题: {journal.topic}</p>
            <p>截止日期: {journal.deadline}</p>
            <p>状态: {journal.status}</p>
        </div>
    );
};

export default Details;