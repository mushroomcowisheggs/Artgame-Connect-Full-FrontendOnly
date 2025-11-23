/**
 * Messages Module (Full-stack style replicated)
 * 消息模块（模仿全栈版本）
 */

// 可选的创作领域分类 (与 i18n key 对应)
const MESSAGE_CATEGORIES = [
    { key: 'all', i18n: 'all' },
    { key: 'general', i18n: 'category_general' },
    { key: 'painting', i18n: 'category_painting' },
    { key: 'music', i18n: 'category_music' },
    { key: 'writing', i18n: 'category_writing' },
    { key: 'programming', i18n: 'category_programming' },
    { key: 'photography', i18n: 'category_photography' },
    { key: 'modeling', i18n: 'category_modeling' },
    { key: 'animation', i18n: 'category_animation' },
    { key: 'sound', i18n: 'category_sound' },
    { key: 'management', i18n: 'category_management' },
    { key: 'design', i18n: 'category_design' }
];

let currentMessageCategory = 'all';

function renderMessageDomainSelect() {
    const container = document.getElementById('messages-filter-container');
    if (!container) return;
    // Create / replace select
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '8px';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.alignItems = 'center';

    const label = document.createElement('label');
    label.htmlFor = 'messageDomainSelect';
    label.style.fontSize = '13px';
    label.style.color = '#555';
    label.setAttribute('data-i18n', 'domainFilter');
    label.textContent = t('domainFilter');
    wrapper.appendChild(label);

    const select = document.createElement('select');
    select.id = 'messageDomainSelect';
    select.style.padding = '6px 8px';
    select.style.border = '1px solid #ccc';
    select.style.borderRadius = '4px';
    select.style.minWidth = '160px';

    MESSAGE_CATEGORIES.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.key;
        opt.textContent = t(cat.i18n);
        opt.setAttribute('data-i18n', cat.i18n);
        if (cat.key === currentMessageCategory) opt.selected = true;
        select.appendChild(opt);
    });
    select.onchange = () => {
        currentMessageCategory = select.value;
        loadMessages(currentMessageCategory);
    };
    wrapper.appendChild(select);

    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'btn btn-secondary btn-small';
    refreshBtn.setAttribute('data-i18n', 'refresh');
    refreshBtn.textContent = t('refresh');
    refreshBtn.onclick = () => loadMessages(currentMessageCategory);
    wrapper.appendChild(refreshBtn);

    container.appendChild(wrapper);
}

function populateMessageCategorySelect() {
    const select = document.getElementById('messageCategory');
    if (!select) return;
    select.innerHTML = '';
    MESSAGE_CATEGORIES.filter(c => c.key !== 'all').forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.key;
        opt.textContent = t(cat.i18n);
        if (cat.key === 'general') opt.selected = true;
        select.appendChild(opt);
    });
}

function setupMessageCategories() {
    renderMessageDomainSelect();
    populateMessageCategorySelect();
}

/**
 * 加载消息列表
 */
async function loadMessages(category = 'all') {
    const messagesList = document.getElementById('messages-list');
    if (!messagesList) return;
    messagesList.innerHTML = `<div class="loading">${t('loadingMessages')}</div>`;
    
    try {
        const url = new URL('../backend/api/api.php', window.location.origin);
        url.searchParams.set('action', 'get_public_messages');
        if (category && category !== 'all') {
            url.searchParams.set('category', category);
        }
        const res = await fetch(url.toString());
        const data = await res.json();
        
        if (data.code === 200 && data.messages) {
            if (data.messages.length === 0) {
                messagesList.innerHTML = `<p style="text-align:center;color:#999;">${t('noData')}</p>`;
                return;
            }
            
            const user = getCurrentUser();
            let html = '';
            data.messages.forEach(msg => {
                html += `
                    <div class="activity-card">
                        <div class="activity-header" style="display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <span class="activity-author">${escapeHtml(msg.author || 'Anonymous')}</span>
                                <span class="activity-time" style="margin-left:12px;">${new Date(msg.createdAt).toLocaleString()}</span>
                                ${msg.category ? `<span class="activity-tag" style="margin-left:12px;padding:2px 6px;background:#eef;border-radius:4px;font-size:0.7rem;color:#556;">${escapeHtml(t('category_' + msg.category) || msg.category)}</span>` : ''}
                            </div>
                            ${(msg.author_id === user.id || user.is_admin == 1) ? `<button class="btn btn-secondary btn-small" onclick="deleteMessage(${msg.id})" style="padding:4px 8px;font-size:0.8rem;">× ${t('delete') || 'Delete'}</button>` : ''}
                        </div>
                        <div class="activity-content">${escapeHtml(msg.content)}</div>
                    </div>
                `;
            });
            messagesList.innerHTML = html;
        } else {
            messagesList.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
        }
    } catch (err) {
        messagesList.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
    }
}

/**
 * 打开消息弹窗
 */
function openMessageModal() {
    document.getElementById('messageModal').classList.add('show');
    populateMessageCategorySelect();
}

/**
 * 关闭消息弹窗
 */
function closeMessageModal() {
    document.getElementById('messageModal').classList.remove('show');
    document.getElementById('messageContent').value = '';
}

/**
 * 提交消息
 */
async function submitMessage() {
    const content = document.getElementById('messageContent').value.trim();
    const categorySelect = document.getElementById('messageCategory');
    const category = categorySelect ? categorySelect.value : 'general';
    
    if (!content) {
        alert('Please enter message content');
        return;
    }
    
    try {
        const res = await fetch('../backend/api/api.php?action=add_public_message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: content, category })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            closeMessageModal();
            loadMessages(currentMessageCategory);
            alert(t('success'));
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 删除消息
 */
async function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
        const user = getCurrentUser();
        const res = await fetch('../backend/api/api.php?action=delete_message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message_id: messageId,
                is_admin: user.is_admin == 1 
            })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            loadMessages(currentMessageCategory);
            alert('Message deleted');
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

// 初始化分类与加载（在前端单页环境中 DOMContentLoaded 可能已触发，采取延迟调用）
document.addEventListener('DOMContentLoaded', () => {
    setupMessageCategories();
    loadMessages(currentMessageCategory);
});

// 暴露全局（供 HTML inline 使用）
window.loadMessages = loadMessages;
window.openMessageModal = openMessageModal;
window.closeMessageModal = closeMessageModal;
window.submitMessage = submitMessage;
window.deleteMessage = deleteMessage;
