/**
 * Mock Backend - 前端數據庫模擬層
 * 使用 localStorage 和內存數據結構模擬後端 API
 */

class MockBackend {
    constructor() {
        this.initializeDatabase();
    }

    /**
     * 初始化數據庫結構
     */
    initializeDatabase() {
        // 初始化各個數據表
        if (!localStorage.getItem('db_users')) {
            localStorage.setItem('db_users', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_messages')) {
            localStorage.setItem('db_messages', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_projects')) {
            localStorage.setItem('db_projects', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_subscriptions')) {
            localStorage.setItem('db_subscriptions', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_activities')) {
            localStorage.setItem('db_activities', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_likes')) {
            localStorage.setItem('db_likes', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_comments')) {
            localStorage.setItem('db_comments', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_collaboration_projects')) {
            localStorage.setItem('db_collaboration_projects', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_milestones')) {
            localStorage.setItem('db_milestones', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_collaboration_messages')) {
            localStorage.setItem('db_collaboration_messages', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_ratings')) {
            localStorage.setItem('db_ratings', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_subscribable_projects')) {
            localStorage.setItem('db_subscribable_projects', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_project_subscriptions')) {
            localStorage.setItem('db_project_subscriptions', JSON.stringify([]));
        }
        if (!localStorage.getItem('session')) {
            localStorage.setItem('session', JSON.stringify({}));
        }
        
        // 插入示例數據（僅在首次初始化時）
        this.insertSampleData();
    }

    /**
     * 插入示例數據
     */
    insertSampleData() {
        const users = this.getTable('db_users');
        
        // 如果已有用戶數據，跳過
        if (users.length > 0) return;

        // 創建示例用戶
        const sampleUsers = [
            {
                id: 1,
                username: 'Alice',
                email: 'alice@example.com',
                password: this.hashPassword('123456'),
                user_role: 'creator',
                skills: 'UI Design, Illustration',
                reputation_score: 4.8,
                badges: 'Top Creator',
                is_admin: 1,
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                username: 'Bob',
                email: 'bob@example.com',
                password: this.hashPassword('123456'),
                user_role: 'requester',
                skills: '',
                reputation_score: 4.5,
                badges: '',
                is_admin: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 3,
                username: 'Charlie',
                email: 'charlie@example.com',
                password: this.hashPassword('123456'),
                user_role: 'creator',
                skills: '3D Modeling, Animation',
                reputation_score: 4.9,
                badges: 'Expert',
                is_admin: 0,
                created_at: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('db_users', JSON.stringify(sampleUsers));

        // 創建示例消息
        const sampleMessages = [
            {
                id: 1,
                content: 'Welcome to Art Game Connect! 歡迎來到藝術遊戲連結平台！',
                author: 'Alice',
                author_id: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                content: 'Looking for talented 3D artists for my game project. 尋找有才華的3D藝術家參與我的遊戲項目。',
                author: 'Bob',
                author_id: 2,
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('db_messages', JSON.stringify(sampleMessages));

        // 創建示例項目
        const sampleProjects = [
            {
                id: 1,
                title: 'Fantasy RPG Character Design',
                description: 'Need character designs for a fantasy RPG game',
                budget: '$500-$1000',
                tags: 'Character Design, Fantasy',
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                title: '3D Environment Modeling',
                description: 'Looking for 3D environment artist',
                budget: '$1000-$2000',
                tags: '3D Modeling, Environment',
                created_at: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('db_projects', JSON.stringify(sampleProjects));

        // 創建示例活動
        const sampleActivities = [
            {
                id: 1,
                type: 'post',
                title: 'New Project Available',
                content: 'Just posted a new character design project!',
                image: '',
                author: 'Bob',
                author_id: 2,
                like_count: 5,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                type: 'task',
                title: 'Urgent: UI Designer Needed',
                content: 'Need a UI designer for mobile game interface',
                image: '',
                author: 'Alice',
                author_id: 1,
                like_count: 3,
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('db_activities', JSON.stringify(sampleActivities));
    }

    /**
     * 簡單密碼哈希（實際應用中應使用更安全的方法）
     */
    hashPassword(password) {
        // 簡單的哈希模擬，實際應使用 bcrypt 等
        return 'hashed_' + btoa(password);
    }

    /**
     * 驗證密碼
     */
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    /**
     * 獲取表數據
     */
    getTable(tableName) {
        return JSON.parse(localStorage.getItem(tableName) || '[]');
    }

    /**
     * 保存表數據
     */
    saveTable(tableName, data) {
        localStorage.setItem(tableName, JSON.stringify(data));
    }

    /**
     * 獲取會話數據
     */
    getSession() {
        return JSON.parse(localStorage.getItem('session') || '{}');
    }

    /**
     * 保存會話數據
     */
    saveSession(session) {
        localStorage.setItem('session', JSON.stringify(session));
    }

    /**
     * 生成新 ID
     */
    generateId(tableName) {
        const table = this.getTable(tableName);
        if (table.length === 0) return 1;
        return Math.max(...table.map(item => item.id || 0)) + 1;
    }

    /**
     * ===== 認證 API =====
     */
    
    async login(data) {
        const email = data.email?.trim();
        const password = data.password?.trim();
        
        if (!email || !password) {
            throw new Error('邮箱和密码不能为空 Email and password cannot be empty');
        }
        
        const users = this.getTable('db_users');
        const user = users.find(u => u.email === email);
        
        if (!user || !this.verifyPassword(password, user.password)) {
            throw new Error('邮箱或密码错误 Invalid email or password');
        }
        
        // 設置會話
        const session = {
            user_id: user.id,
            username: user.username,
            user_role: user.user_role,
            is_admin: user.is_admin || 0
        };
        this.saveSession(session);
        
        const userCopy = { ...user };
        delete userCopy.password;
        
        return { code: 200, message: '登录成功 Login successful', user: userCopy };
    }

    async register(data) {
        const username = data.username?.trim();
        const email = data.email?.trim();
        const password = data.password?.trim();
        
        if (!username || !email || !password) {
            throw new Error('所有字段都必须填写 All fields are required');
        }
        
        const users = this.getTable('db_users');
        
        if (users.find(u => u.username === username)) {
            throw new Error('用户名已存在 Username already exists');
        }
        
        if (users.find(u => u.email === email)) {
            throw new Error('邮箱已被使用 Email already in use');
        }
        
        const newUser = {
            id: this.generateId('db_users'),
            username,
            email,
            password: this.hashPassword(password),
            user_role: 'creator',
            skills: '',
            reputation_score: 0,
            badges: '',
            is_admin: 0,
            created_at: new Date().toISOString()
        };
        
        users.push(newUser);
        this.saveTable('db_users', users);
        
        return { code: 200, message: '注册成功 Registration successful' };
    }

    async logout() {
        this.saveSession({});
        return { code: 200, message: '已注销 Has been cancelled' };
    }

    async whoami() {
        const session = this.getSession();
        
        if (!session.user_id) {
            return { code: 401, message: '未登录 Not logged in' };
        }
        
        const users = this.getTable('db_users');
        const user = users.find(u => u.id === session.user_id);
        
        if (!user) {
            return { code: 401, message: '会话用户不存在 The session user does not exist' };
        }
        
        const userCopy = { ...user };
        delete userCopy.password;
        
        return { code: 200, user: userCopy };
    }

    async switchUserRole(data) {
        const newRole = data.role?.trim();
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (!['creator', 'requester'].includes(newRole)) {
            throw new Error('无效的角色 Invalid role');
        }
        
        const users = this.getTable('db_users');
        const userIndex = users.findIndex(u => u.id === session.user_id);
        
        if (userIndex === -1) {
            throw new Error('用户不存在 User not found');
        }
        
        users[userIndex].user_role = newRole;
        this.saveTable('db_users', users);
        
        session.user_role = newRole;
        this.saveSession(session);
        
        return { code: 200, message: '角色切换成功 Role switched successfully', role: newRole };
    }

    /**
     * ===== 消息 API =====
     */
    
    async getMessages() {
        const messages = this.getTable('db_messages');
        return { code: 200, messages: messages.reverse() };
    }

    async addMessage(data) {
        const content = data.content?.trim() || data.col_content?.trim();
        
        if (!content) {
            throw new Error('消息内容不能为空 The content of the message cannot be empty');
        }
        
        const session = this.getSession();
        const author = session.username || data.col_author || data.author || '匿名Anonymous';
        const authorId = session.user_id || null;
        
        const messages = this.getTable('db_messages');
        const newMessage = {
            id: this.generateId('db_messages'),
            content,
            author,
            author_id: authorId,
            createdAt: new Date().toISOString()
        };
        
        messages.push(newMessage);
        this.saveTable('db_messages', messages);
        
        return { code: 200, message: '添加成功 Added successfully' };
    }

    async deleteMessage(data) {
        const id = parseInt(data.message_id || data.col_id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录或权限不足 Not logged in or insufficient permissions');
        }
        
        const messages = this.getTable('db_messages');
        const messageIndex = messages.findIndex(m => m.id === id);
        
        if (messageIndex === -1) {
            throw new Error('消息不存在 The message does not exist.');
        }
        
        const message = messages[messageIndex];
        const isAdmin = session.is_admin || 0;
        
        if (!isAdmin && message.author_id !== session.user_id) {
            throw new Error('没有权限删除该消息 No permission to delete this message');
        }
        
        messages.splice(messageIndex, 1);
        this.saveTable('db_messages', messages);
        
        return { code: 200, message: '删除成功 Deleted successfully' };
    }

    /**
     * ===== 項目 API =====
     */
    
    async getProjects() {
        const projects = this.getTable('db_projects');
        return { code: 200, projects: projects.reverse() };
    }

    async addProject(data) {
        const title = data.title?.trim();
        const description = data.description?.trim() || '';
        const budget = data.budget?.trim() || '';
        const tags = data.tags?.trim() || '';
        
        if (!title) {
            throw new Error('项目标题不能为空 Project title cannot be empty');
        }
        
        const projects = this.getTable('db_projects');
        const newProject = {
            id: this.generateId('db_projects'),
            title,
            description,
            budget,
            tags,
            created_at: new Date().toISOString()
        };
        
        projects.push(newProject);
        this.saveTable('db_projects', projects);
        
        return { code: 200, message: '项目创建成功 Project created successfully' };
    }

    async subscribeProject(data) {
        const projectId = parseInt(data.project_id || 0);
        const subscriber = data.subscriber?.trim();
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        if (!subscriber) {
            throw new Error('订阅者名称不能为空 Subscriber name cannot be empty');
        }
        
        const subscriptions = this.getTable('db_subscriptions');
        const newSubscription = {
            id: this.generateId('db_subscriptions'),
            project_id: projectId,
            subscriber,
            created_at: new Date().toISOString()
        };
        
        subscriptions.push(newSubscription);
        this.saveTable('db_subscriptions', subscriptions);
        
        return { code: 200, message: '订阅成功 Subscription successful' };
    }

    async getSubscriptions(projectId) {
        projectId = parseInt(projectId);
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        const subscriptions = this.getTable('db_subscriptions');
        const filtered = subscriptions.filter(s => s.project_id === projectId).reverse();
        
        return { code: 200, subscriptions: filtered };
    }

    async deleteProject(data) {
        const projectId = parseInt(data.project_id || data.id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (!session.is_admin) {
            throw new Error('没有权限删除项目 No permission to delete project');
        }
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        // 刪除項目
        let projects = this.getTable('db_projects');
        projects = projects.filter(p => p.id !== projectId);
        this.saveTable('db_projects', projects);
        
        // 刪除相關訂閱
        let subscriptions = this.getTable('db_subscriptions');
        subscriptions = subscriptions.filter(s => s.project_id !== projectId);
        this.saveTable('db_subscriptions', subscriptions);
        
        // 刪除協作項目
        let collabProjects = this.getTable('db_collaboration_projects');
        collabProjects = collabProjects.filter(p => p.id !== projectId && p.project_id !== projectId);
        this.saveTable('db_collaboration_projects', collabProjects);
        
        return { code: 200, message: '删除成功 Project deleted successfully' };
    }

    async withdrawProject(data) {
        const projectId = parseInt(data.project_id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        const projects = this.getTable('db_collaboration_projects');
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) {
            throw new Error('项目不存在 Project not found');
        }
        
        const project = projects[projectIndex];
        
        if (project.requester_id !== session.user_id) {
            throw new Error('只有需求方可以撤回项目 Only the requester can withdraw the project');
        }
        
        if (project.status !== 'open') {
            throw new Error('只能撤回开放状态的项目 Can only withdraw open projects');
        }
        
        projects[projectIndex].withdrawn = 1;
        projects[projectIndex].withdrawn_at = new Date().toISOString();
        projects[projectIndex].status = 'withdrawn';
        this.saveTable('db_collaboration_projects', projects);
        
        return { code: 200, message: '项目撤回成功 Project withdrawn successfully' };
    }

    /**
     * ===== 活動 API =====
     */
    
    async getFeed() {
        const activities = this.getTable('db_activities');
        const session = this.getSession();
        const userId = session.user_id;
        
        // 添加評論數和點讚狀態
        const feed = activities.map(activity => {
            const comments = this.getTable('db_comments').filter(c => c.activity_id === activity.id);
            const likes = this.getTable('db_likes');
            const isLiked = userId ? likes.some(l => l.activity_id === activity.id && l.user_id === userId) : false;
            
            return {
                ...activity,
                comment_count: comments.length,
                is_liked: isLiked
            };
        }).reverse();
        
        return { code: 200, feed };
    }

    async publishActivity(data) {
        const type = data.type?.trim() || 'post';
        const title = data.title?.trim() || '';
        const content = data.content?.trim();
        const image = data.image?.trim() || '';
        const session = this.getSession();
        const author = session.username || '匿名Anonymous';
        const authorId = session.user_id || null;
        
        if (!content) {
            throw new Error('内容不能为空 Content cannot be empty');
        }
        
        const activities = this.getTable('db_activities');
        const newActivity = {
            id: this.generateId('db_activities'),
            type,
            title,
            content,
            image,
            author,
            author_id: authorId,
            like_count: 0,
            createdAt: new Date().toISOString()
        };
        
        activities.push(newActivity);
        this.saveTable('db_activities', activities);
        
        return { code: 200, message: '发布成功 Published successfully' };
    }

    async deleteActivity(data) {
        const activityId = parseInt(data.activity_id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (activityId <= 0) {
            throw new Error('无效的活动ID Invalid activity ID');
        }
        
        const activities = this.getTable('db_activities');
        const activityIndex = activities.findIndex(a => a.id === activityId);
        
        if (activityIndex === -1) {
            throw new Error('活动不存在 Activity not found');
        }
        
        const activity = activities[activityIndex];
        const isAdmin = session.is_admin || 0;
        
        if (!isAdmin && activity.author_id !== session.user_id) {
            throw new Error('没有权限删除 No permission to delete');
        }
        
        // 刪除活動及相關數據
        activities.splice(activityIndex, 1);
        this.saveTable('db_activities', activities);
        
        let likes = this.getTable('db_likes');
        likes = likes.filter(l => l.activity_id !== activityId);
        this.saveTable('db_likes', likes);
        
        let comments = this.getTable('db_comments');
        comments = comments.filter(c => c.activity_id !== activityId);
        this.saveTable('db_comments', comments);
        
        return { code: 200, message: '删除成功 Deleted successfully' };
    }

    async toggleLike(data) {
        const activityId = parseInt(data.activity_id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (activityId <= 0) {
            throw new Error('无效的活动ID Invalid activity ID');
        }
        
        const likes = this.getTable('db_likes');
        const likeIndex = likes.findIndex(l => l.activity_id === activityId && l.user_id === session.user_id);
        
        const activities = this.getTable('db_activities');
        const activityIndex = activities.findIndex(a => a.id === activityId);
        
        if (activityIndex === -1) {
            throw new Error('活动不存在 Activity not found');
        }
        
        let message;
        
        if (likeIndex !== -1) {
            // 取消點讚
            likes.splice(likeIndex, 1);
            activities[activityIndex].like_count = Math.max(0, (activities[activityIndex].like_count || 0) - 1);
            message = '已取消点赞 Unliked';
        } else {
            // 添加點讚
            likes.push({
                id: this.generateId('db_likes'),
                activity_id: activityId,
                user_id: session.user_id,
                created_at: new Date().toISOString()
            });
            activities[activityIndex].like_count = (activities[activityIndex].like_count || 0) + 1;
            message = '点赞成功 Liked';
        }
        
        this.saveTable('db_likes', likes);
        this.saveTable('db_activities', activities);
        
        return { code: 200, message };
    }

    async getComments(activityId) {
        activityId = parseInt(activityId);
        
        if (activityId <= 0) {
            throw new Error('无效的活动ID Invalid activity ID');
        }
        
        const comments = this.getTable('db_comments');
        const users = this.getTable('db_users');
        
        const filtered = comments
            .filter(c => c.activity_id === activityId)
            .map(comment => {
                const user = users.find(u => u.id === comment.user_id);
                return {
                    ...comment,
                    username: user ? user.username : '未知用户'
                };
            });
        
        return { code: 200, comments: filtered };
    }

    async addComment(data) {
        const activityId = parseInt(data.activity_id || 0);
        const content = data.content?.trim();
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (activityId <= 0) {
            throw new Error('无效的活动ID Invalid activity ID');
        }
        
        if (!content) {
            throw new Error('评论内容不能为空 Comment cannot be empty');
        }
        
        const comments = this.getTable('db_comments');
        const newComment = {
            id: this.generateId('db_comments'),
            activity_id: activityId,
            user_id: session.user_id,
            content,
            created_at: new Date().toISOString()
        };
        
        comments.push(newComment);
        this.saveTable('db_comments', comments);
        
        return { code: 200, message: '评论成功 Comment added' };
    }

    async deleteComment(data) {
        const commentId = parseInt(data.comment_id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (commentId <= 0) {
            throw new Error('无效的评论ID Invalid comment ID');
        }
        
        const comments = this.getTable('db_comments');
        const commentIndex = comments.findIndex(c => c.id === commentId);
        
        if (commentIndex === -1) {
            throw new Error('评论不存在 Comment not found');
        }
        
        const comment = comments[commentIndex];
        const isAdmin = session.is_admin || 0;
        
        if (!isAdmin && comment.user_id !== session.user_id) {
            throw new Error('没有权限删除 No permission to delete');
        }
        
        comments.splice(commentIndex, 1);
        this.saveTable('db_comments', comments);
        
        return { code: 200, message: '删除成功 Deleted successfully' };
    }

    /**
     * ===== 協作 API =====
     */
    
    async getCollaborationProjects() {
        const projects = this.getTable('db_collaboration_projects');
        return { code: 200, projects: projects.reverse() };
    }

    async getCollaborationProject(projectId) {
        projectId = parseInt(projectId);
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        const projects = this.getTable('db_collaboration_projects');
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
            throw new Error('项目不存在 Project not found');
        }
        
        // 獲取里程碑
        const milestones = this.getTable('db_milestones').filter(m => m.project_id === projectId);
        
        // 獲取消息
        const messages = this.getTable('db_collaboration_messages');
        const users = this.getTable('db_users');
        const projectMessages = messages
            .filter(m => m.project_id === projectId)
            .map(msg => {
                const user = users.find(u => u.id === msg.sender_id);
                return {
                    ...msg,
                    username: user ? user.username : '未知用户'
                };
            });
        
        // 獲取需求方和創作者信息
        const requester = users.find(u => u.id === project.requester_id);
        const creator = project.creator_id ? users.find(u => u.id === project.creator_id) : null;
        
        return {
            code: 200,
            project: {
                ...project,
                milestones,
                messages: projectMessages,
                requester: requester ? { id: requester.id, username: requester.username, user_role: requester.user_role, skills: requester.skills } : null,
                creator: creator ? { id: creator.id, username: creator.username, user_role: creator.user_role, skills: creator.skills } : null
            }
        };
    }

    async createCollaborationProject(data) {
        const title = data.title?.trim();
        const description = data.description?.trim() || '';
        const budget = parseFloat(data.budget || 0);
        const skillTag = data.tags?.trim() || '';
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (!title) {
            throw new Error('标题不能为空 Title cannot be empty');
        }
        
        // 創建基礎項目
        const projects = this.getTable('db_projects');
        const baseProject = {
            id: this.generateId('db_projects'),
            title,
            description,
            budget: budget.toString(),
            tags: skillTag,
            created_at: new Date().toISOString()
        };
        projects.push(baseProject);
        this.saveTable('db_projects', projects);
        
        // 創建協作項目
        const collabProjects = this.getTable('db_collaboration_projects');
        const collabProject = {
            id: this.generateId('db_collaboration_projects'),
            project_id: baseProject.id,
            title,
            description,
            budget,
            tags: skillTag,
            requester_id: session.user_id,
            creator_id: null,
            status: 'open',
            requester_confirmed: 0,
            creator_confirmed: 0,
            withdrawn: 0,
            created_at: new Date().toISOString()
        };
        collabProjects.push(collabProject);
        this.saveTable('db_collaboration_projects', collabProjects);
        
        return { code: 200, message: '项目创建成功 Project created successfully', project_id: collabProject.id };
    }

    async applyCollaborationProject(data) {
        const projectId = parseInt(data.project_id || 0);
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        const projects = this.getTable('db_collaboration_projects');
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) {
            throw new Error('项目不存在 Project not found');
        }
        
        projects[projectIndex].creator_id = session.user_id;
        projects[projectIndex].status = 'in_progress';
        this.saveTable('db_collaboration_projects', projects);
        
        return { code: 200, message: '申请成功 Application submitted successfully' };
    }

    async addCollaborationMessage(data) {
        const projectId = parseInt(data.project_id || 0);
        const content = data.content?.trim();
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        if (!content) {
            throw new Error('消息不能为空 Message cannot be empty');
        }
        
        const messages = this.getTable('db_collaboration_messages');
        const newMessage = {
            id: this.generateId('db_collaboration_messages'),
            project_id: projectId,
            sender_id: session.user_id,
            content,
            created_at: new Date().toISOString()
        };
        
        messages.push(newMessage);
        this.saveTable('db_collaboration_messages', messages);
        
        return { code: 200, message: '消息发送成功 Message added successfully' };
    }

    async updateMilestoneStatus(data) {
        const milestoneId = parseInt(data.milestone_id || 0);
        const status = data.status?.trim();
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        if (milestoneId <= 0) {
            throw new Error('无效的里程碑ID Invalid milestone ID');
        }
        
        const milestones = this.getTable('db_milestones');
        const milestoneIndex = milestones.findIndex(m => m.id === milestoneId);
        
        if (milestoneIndex === -1) {
            throw new Error('里程碑不存在 Milestone not found');
        }
        
        const milestone = milestones[milestoneIndex];
        const projects = this.getTable('db_collaboration_projects');
        const project = projects.find(p => p.id === milestone.project_id);
        
        if (!project || project.requester_id !== session.user_id) {
            throw new Error('权限不足 Permission denied');
        }
        
        milestones[milestoneIndex].status = status;
        this.saveTable('db_milestones', milestones);
        
        return { code: 200, message: '里程碑更新成功 Milestone updated successfully' };
    }

    async getMatchingCreators(skillTag) {
        skillTag = skillTag?.trim();
        
        if (!skillTag) {
            throw new Error('技能标签不能为空 Skill tag required');
        }
        
        const users = this.getTable('db_users');
        const creators = users
            .filter(u => u.user_role === 'creator' && u.skills && u.skills.toLowerCase().includes(skillTag.toLowerCase()))
            .sort((a, b) => (b.reputation_score || 0) - (a.reputation_score || 0));
        
        return { code: 200, creators };
    }

    /**
     * ===== 個人資料 API =====
     */
    
    async getUserProfile() {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const users = this.getTable('db_users');
        const user = users.find(u => u.id === session.user_id);
        
        if (!user) {
            throw new Error('用户不存在 User not found');
        }
        
        const userCopy = { ...user };
        delete userCopy.password;
        
        return { code: 200, profile: userCopy };
    }

    async addSkill(data) {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const skill = data.skill?.trim();
        
        if (!skill) {
            throw new Error('技能不能为空 Skill cannot be empty');
        }
        
        const users = this.getTable('db_users');
        const userIndex = users.findIndex(u => u.id === session.user_id);
        
        if (userIndex === -1) {
            throw new Error('用户不存在 User not found');
        }
        
        const currentSkills = users[userIndex].skills ? users[userIndex].skills.split(',').map(s => s.trim()) : [];
        
        if (!currentSkills.includes(skill)) {
            currentSkills.push(skill);
            users[userIndex].skills = currentSkills.join(', ');
            this.saveTable('db_users', users);
        }
        
        return { code: 200, message: '技能添加成功 Skill added successfully' };
    }

    async getMySubscribableProjects() {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const projects = this.getTable('db_subscribable_projects');
        const subscriptions = this.getTable('db_project_subscriptions');
        
        const myProjects = projects
            .filter(p => p.creator_id === session.user_id)
            .map(project => ({
                ...project,
                subscriber_count: subscriptions.filter(s => s.project_id === project.id).length
            }));
        
        return { code: 200, projects: myProjects };
    }

    async publishSubscribableProject(data) {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const title = data.title?.trim();
        const description = data.description?.trim() || '';
        const price = parseFloat(data.price || 0);
        
        if (!title) {
            throw new Error('标题不能为空 Title cannot be empty');
        }
        
        const projects = this.getTable('db_subscribable_projects');
        const newProject = {
            id: this.generateId('db_subscribable_projects'),
            creator_id: session.user_id,
            title,
            description,
            price,
            created_at: new Date().toISOString()
        };
        
        projects.push(newProject);
        this.saveTable('db_subscribable_projects', projects);
        
        return { code: 200, message: '项目发布成功 Project published successfully' };
    }

    async confirmProjectCompletion(data) {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const projectId = parseInt(data.project_id || 0);
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        const projects = this.getTable('db_collaboration_projects');
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) {
            throw new Error('项目不存在 Project not found');
        }
        
        const project = projects[projectIndex];
        const isRequester = project.requester_id === session.user_id;
        const isCreator = project.creator_id === session.user_id;
        
        if (!isRequester && !isCreator) {
            throw new Error('您不是该项目成员 You are not part of this project');
        }
        
        if (isRequester) {
            projects[projectIndex].requester_confirmed = 1;
        } else {
            projects[projectIndex].creator_confirmed = 1;
        }
        
        // 檢查雙方是否都已確認
        if (projects[projectIndex].requester_confirmed && projects[projectIndex].creator_confirmed) {
            projects[projectIndex].status = 'closed';
            projects[projectIndex].completed_at = new Date().toISOString();
        }
        
        this.saveTable('db_collaboration_projects', projects);
        
        return { code: 200, message: '完成确认成功 Completion confirmed' };
    }

    async submitProjectReview(data) {
        const session = this.getSession();
        
        if (!session.user_id) {
            throw new Error('未登录 Not logged in');
        }
        
        const projectId = parseInt(data.project_id || 0);
        const rating = parseInt(data.rating || 0);
        const comment = data.comment?.trim() || '';
        
        if (projectId <= 0) {
            throw new Error('无效的项目ID Invalid project ID');
        }
        
        if (rating < 1 || rating > 5) {
            throw new Error('评分必须在1-5之间 Rating must be between 1 and 5');
        }
        
        const projects = this.getTable('db_collaboration_projects');
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
            throw new Error('项目不存在 Project not found');
        }
        
        const isRequester = project.requester_id === session.user_id;
        const isCreator = project.creator_id === session.user_id;
        
        if (!isRequester && !isCreator) {
            throw new Error('您不是该项目成员 You are not part of this project');
        }
        
        const revieweeId = isRequester ? project.creator_id : project.requester_id;
        
        // 插入評價
        const ratings = this.getTable('db_ratings');
        const newRating = {
            id: this.generateId('db_ratings'),
            project_id: projectId,
            rater_id: session.user_id,
            rated_id: revieweeId,
            score: rating,
            comment,
            created_at: new Date().toISOString()
        };
        ratings.push(newRating);
        this.saveTable('db_ratings', ratings);
        
        // 更新被評價者的聲譽分數
        const userRatings = ratings.filter(r => r.rated_id === revieweeId);
        const avgScore = userRatings.reduce((sum, r) => sum + r.score, 0) / userRatings.length;
        
        const users = this.getTable('db_users');
        const userIndex = users.findIndex(u => u.id === revieweeId);
        if (userIndex !== -1) {
            users[userIndex].reputation_score = avgScore;
            this.saveTable('db_users', users);
        }
        
        return { code: 200, message: '评价提交成功 Review submitted successfully' };
    }

    /**
     * ===== 文件上傳 API =====
     */
    
    async upload(file) {
        // 模擬文件上傳，返回本地路徑
        const fileName = file.name;
        const timestamp = Date.now();
        const fakePath = `./assets/uploads/${timestamp}_${fileName}`;
        
        return { code: 200, message: '上传成功 Upload successful', path: fakePath };
    }
}

// 創建全局實例
window.mockBackend = new MockBackend();
