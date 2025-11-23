/**
 * Plaza Module (Activities Feed)
 * 广场模块 - 活动动态
 */

// Draft & file upload caching for new activity
let plazaPendingFiles = [];
const PLAZA_DRAFT_KEY = 'plaza_draft_activity';

function handlePlazaFileSelection() {
    const input = document.getElementById('activityFiles');
    const list = document.getElementById('activity-file-list');
    if (!input || !list) return;
    const files = input.files;
    plazaPendingFiles = [];
    list.innerHTML = '';
    if (!files || !files.length) { savePlazaDraft(); return; }
    Array.from(files).forEach((file, idx) => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding:8px;border:1px solid #eee;border-radius:6px;margin-bottom:6px;background:#fafafa;display:flex;gap:12px;align-items:flex-start;';
        wrapper.innerHTML = `<div style="flex:1;">\n            <div style="font-weight:600;font-size:13px;">📎 ${escapeHtml(file.name)} <span style=\"color:#999;font-weight:400;\">(${(file.size/1024).toFixed(1)} KB)</span></div>\n            <div id="activity-preview-${idx}" style="margin-top:6px;font-size:12px;color:#555;">${t('generatingPreview') || 'Generating preview...'}</div>\n        </div>`;
        list.appendChild(wrapper);
        const reader = new FileReader();
        const rec = { name: file.name, size: file.size, type: file.type, uploadedAt: new Date().toISOString(), previewType: null, previewData: null };
        if (file.type.startsWith('image/')) {
            reader.onload = e => {
                rec.previewType = 'image';
                rec.previewData = e.target.result;
                const pv = document.getElementById(`activity-preview-${idx}`);
                if (pv) pv.innerHTML = `<img src="${e.target.result}" alt="${escapeHtml(file.name)}" style="max-width:160px;border-radius:4px;box-shadow:0 0 0 1px #ddd;" />`;
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('text/') || file.type === 'application/json') {
            reader.onload = e => {
                rec.previewType = 'text';
                const content = e.target.result.slice(0, 300);
                rec.previewData = content;
                const pv = document.getElementById(`activity-preview-${idx}`);
                if (pv) pv.textContent = content + (e.target.result.length > 300 ? ' ...' : '');
            };
            reader.readAsText(file);
        } else {
            const pv = document.getElementById(`activity-preview-${idx}`);
            if (pv) pv.textContent = t('noPreviewAvailable') || 'No preview available';
        }
        plazaPendingFiles.push(rec);
    });
    savePlazaDraft();
}

function savePlazaDraft() {
    const title = document.getElementById('activityTitle')?.value || '';
    const content = document.getElementById('activityContent')?.value || '';
    const draft = { title, content, files: plazaPendingFiles.map(serializeFileRecord) };
    saveToLocalJson(PLAZA_DRAFT_KEY, draft);
}

function loadPlazaDraft() {
    return loadFromLocalJson(PLAZA_DRAFT_KEY, null);
}

/**
 * 加载活动 Feed
 */
async function loadFeed() {
    const feedList = document.getElementById('feed-list');
    feedList.innerHTML = `<div class="loading">${t('loadingActivities')}</div>`;
    
    try {
        const res = await fetch('../backend/api/api.php?action=get_feed');
        const data = await res.json();
        
        if (data.code === 200 && data.feed) {
            if (data.feed.length === 0) {
                feedList.innerHTML = `<p style="text-align:center;color:#999;">${t('noData')}</p>`;
                return;
            }
            
            const user = getCurrentUser();
            let html = '';
            data.feed.forEach(activity => {
                const likedClass = activity.is_liked ? 'liked' : '';
                const likeIcon = activity.is_liked ? '❤️' : '🤍';
                // 检查是否为管理员或作者
                const canDelete = user.is_admin == 1 || activity.author_id === user.id;
                html += `
                    <div class="activity-card">
                        <div class="activity-header" style="display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <span class="activity-author">${escapeHtml(activity.author || 'Anonymous')}</span>
                                <span class="activity-time" style="margin-left:12px;">${new Date(activity.createdAt).toLocaleString()}</span>
                            </div>
                            ${canDelete ? `<button class="btn btn-secondary btn-small" onclick="deleteActivity(${activity.id})" style="padding:4px 8px;font-size:0.8rem;">× Delete</button>` : ''}
                        </div>
                        ${activity.title ? `<div class="activity-title">${escapeHtml(activity.title)}</div>` : ''}
                        <div class="activity-content">${escapeHtml(activity.content)}</div>
                        ${activity.image ? `<img src="${escapeHtml(activity.image)}" style="max-width:100%;border-radius:8px;margin-top:12px;" alt="Activity image">` : ''}
                        <div class="activity-actions">
                            <button class="action-btn ${likedClass}" onclick="toggleLike(${activity.id})">
                                ${likeIcon} ${activity.like_count || 0}
                            </button>
                            <button class="action-btn" onclick="toggleComments(${activity.id})">
                                💬 ${activity.comment_count || 0}
                            </button>
                        </div>
                        <div id="comments-${activity.id}" class="comments-section" style="display:none;">
                            <div id="comments-list-${activity.id}"></div>
                            <div class="comment-input-area">
                                <input type="text" class="comment-input" id="comment-input-${activity.id}" placeholder="${t('addComment')}">
                                <button class="btn btn-primary btn-small" onclick="submitComment(${activity.id})">${t('submit')}</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            feedList.innerHTML = html;
        } else {
            feedList.innerHTML = `<p style="color:#e74c3c;">${data.message || t('error')}</p>`;
        }
    } catch (err) {
        feedList.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
    }
}

/**
 * 切换点赞
 */
async function toggleLike(activityId) {
    try {
        const res = await fetch('../backend/api/api.php?action=toggle_like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activity_id: activityId })
        });
        const data = await res.json();
        if (data.code === 200) {
            loadFeed();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 切换评论区显示
 */
async function toggleComments(activityId) {
    const commentsDiv = document.getElementById(`comments-${activityId}`);
    if (commentsDiv.style.display === 'none') {
        commentsDiv.style.display = 'block';
        await loadComments(activityId);
    } else {
        commentsDiv.style.display = 'none';
    }
}

/**
 * 加载评论
 */
async function loadComments(activityId) {
    const commentsList = document.getElementById(`comments-list-${activityId}`);
    commentsList.innerHTML = `<div class="loading">${t('loading')}</div>`;
    
    try {
        const res = await fetch(`../backend/api/api.php?action=get_comments&activity_id=${activityId}`);
        const data = await res.json();
        
        if (data.code === 200 && data.comments) {
            if (data.comments.length === 0) {
                commentsList.innerHTML = `<p style="color:#999;font-size:0.9rem;">${t('noData')}</p>`;
                return;
            }
            
            const user = getCurrentUser();
            let html = '';
            data.comments.forEach(comment => {
                // 检查是否为管理员或评论作者
                const canDelete = user.is_admin == 1 || comment.user_id === user.id;
                html += `
                    <div class="comment-item" style="display:flex;justify-content:space-between;align-items:center;">
                        <div style="flex:1;">
                            <div class="comment-author">${escapeHtml(comment.username || 'Anonymous')}</div>
                            <div class="comment-content">${escapeHtml(comment.content)}</div>
                        </div>
                        ${canDelete ? `<button class="btn btn-secondary btn-small" onclick="deleteComment(${comment.id}, ${activityId})" style="padding:2px 6px;font-size:0.75rem;">×</button>` : ''}
                    </div>
                `;
            });
            commentsList.innerHTML = html;
        } else {
            commentsList.innerHTML = `<p style="color:#e74c3c;font-size:0.9rem;">${t('error')}</p>`;
        }
    } catch (err) {
        commentsList.innerHTML = `<p style="color:#e74c3c;font-size:0.9rem;">${t('error')}</p>`;
    }
}

/**
 * 提交评论
 */
async function submitComment(activityId) {
    const input = document.getElementById(`comment-input-${activityId}`);
    const content = input.value.trim();
    
    if (!content) {
        alert('Please enter a comment');
        return;
    }
    
    try {
        const res = await fetch('../backend/api/api.php?action=add_comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                activity_id: activityId,
                content: content
            })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            input.value = '';
            await loadComments(activityId);
            loadFeed(); // 重新加载以更新评论数
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 打开发布活动弹窗
 */
function openActivityModal() {
    document.getElementById('activityModal').classList.add('show');
    // Attach handlers once
    const filesInput = document.getElementById('activityFiles');
    if (filesInput && !filesInput._bound) { filesInput.addEventListener('change', handlePlazaFileSelection); filesInput._bound = true; }
    const titleEl = document.getElementById('activityTitle');
    const contentEl = document.getElementById('activityContent');
    [titleEl, contentEl].forEach(el => { if (el && !el._bound) { el.addEventListener('input', savePlazaDraft); el._bound = true; } });
    // Load draft
    const draft = loadPlazaDraft();
    if (draft) {
        if (titleEl) titleEl.value = draft.title || '';
        if (contentEl) contentEl.value = draft.content || '';
        plazaPendingFiles = draft.files ? draft.files : [];
        // rebuild previews
        const list = document.getElementById('activity-file-list');
        if (list) {
            list.innerHTML = '';
            plazaPendingFiles.forEach((rec, idx) => {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'padding:8px;border:1px solid #eee;border-radius:6px;margin-bottom:6px;background:#fafafa;';
                let previewHtml = '';
                if (rec.previewType === 'image') previewHtml = `<img src="${escapeHtml(rec.previewData)}" alt="${escapeHtml(rec.name)}" style="max-width:160px;border-radius:4px;box-shadow:0 0 0 1px #ddd;" />`;
                else if (rec.previewType === 'text') previewHtml = `<div style="font-size:12px;white-space:pre-wrap;max-height:160px;overflow:auto;background:#fff;border:1px solid #eee;padding:6px;border-radius:4px;">${escapeHtml(rec.previewData)}</div>`;
                else previewHtml = `<div style="font-size:12px;color:#555;">${t('noPreviewAvailable') || 'No preview available'}</div>`;
                wrapper.innerHTML = `<div style="font-weight:600;font-size:13px;">📎 ${escapeHtml(rec.name)} <span style=\"color:#999;font-weight:400;\">(${(rec.size/1024).toFixed(1)} KB)</span></div><div style="margin-top:6px;">${previewHtml}</div>`;
                list.appendChild(wrapper);
            });
        }
    }
}

/**
 * 关闭发布活动弹窗
 */
function closeActivityModal() {
    document.getElementById('activityModal').classList.remove('show');
    // Do not clear draft to preserve between sessions; user can manually edit.
}

/**
 * 提交活动
 */
async function submitActivity() {
    const title = document.getElementById('activityTitle').value.trim();
    const content = document.getElementById('activityContent').value.trim();
    // Use first image file (if any) as image field; fallback empty string
    let image = '';
    const firstImage = plazaPendingFiles.find(f => f.previewType === 'image');
    if (firstImage) image = firstImage.previewData; // base64 data URL
    
    if (!content) {
        alert('Please enter content');
        return;
    }
    
    try {
        const res = await fetch('../backend/api/api.php?action=publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'post',
                title: title,
                content: content,
                image: image
            })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            // Clear draft cache after successful publish
            removeLocalKey(PLAZA_DRAFT_KEY);
            plazaPendingFiles = [];
            const list = document.getElementById('activity-file-list');
            if (list) list.innerHTML = '';
            closeActivityModal();
            loadFeed();
            alert(t('success'));
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 删除活动
 */
async function deleteActivity(activityId) {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    try {
        const res = await fetch('../backend/api/api.php?action=delete_activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activity_id: activityId })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            loadFeed();
            alert('Activity deleted');
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 删除评论
 */
async function deleteComment(commentId, activityId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
        const res = await fetch('../backend/api/api.php?action=delete_comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment_id: commentId })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            await loadComments(activityId);
            loadFeed(); // 重新加载以更新评论数
            alert('Comment deleted');
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}
