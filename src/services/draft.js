// 获取约稿列表
export const getDraftList = async (filters) => {
    try {
        // 这里应该是实际的API调用
        // const response = await fetch('/api/drafts', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //   }
        // });
        // return await response.json();

        // 现在返回模拟数据
        return mockDrafts;
    } catch (error) {
        console.error('获取约稿列表失败:', error);
        throw error;
    }
};

// 创建新约稿
export const createDraft = async (draftData) => {
    try {
        // 实际API调用
        // const response = await fetch('/api/drafts', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //   },
        //   body: JSON.stringify(draftData)
        // });
        // return await response.json();
    } catch (error) {
        console.error('创建约稿失败:', error);
        throw error;
    }
};