/**
 * Profile Module
 * 用户资料模块
 */

/**
 * 加载用户资料页面
 */
async function loadProfile() {
    const profileContent = document.getElementById('profile-content');
    profileContent.innerHTML = `<div class="loading">${t('loadingProfile')}</div>`;
    
    const user = getCurrentUser();
    if (!user) {
        profileContent.innerHTML = `<p style="color:#e74c3c;">${t('notLoggedIn')}</p>`;
        return;
    }

    try {
        const res = await fetch('../backend/api/api.php?action=get_user_profile');
        const data = await res.json();
        
        if (data.code === 200 && data.profile) {
            const profile = data.profile;
            const skills = parseSkills(profile.skills);
            
            let html = `
                <div class="profile-header">
                    <img src="${profile.avatar && profile.avatar.trim() ? profile.avatar : './assets/images/avatar_32.png'}" alt="Avatar" class="profile-avatar">
                    <h2>${escapeHtml(profile.username)}</h2>
                    <p class="profile-role">${profile.user_role === 'requester' ? t('requester') : t('creator')}</p>
                    <p class="profile-score">${t('reputationScore') || t('reputation')}: ${profile.reputation_score}</p>
                    <div class="profile-badges">
                        ${profile.badges && profile.badges.trim() ? `<span class="badge">${escapeHtml(profile.badges)}</span>` : ''}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3>${t('skills')}</h3>
                    <div class="skill-tags">
                        ${skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                    </div>
                    <input type="text" id="newSkillInput" placeholder="${t('addSkillPlaceholder')}" style="margin-top:10px;">
                    <button class="btn btn-secondary btn-small" onclick="addSkill()">${t('addSkill')}</button>
                </div>
                
                <div class="profile-section">
                    <h3>${t('myProjects')}</h3>
                    <div id="my-projects-list">${t('loading')}</div>
                </div>
                <div class="profile-section">
                    <h3>${t('personalProjects') || 'Personal Projects'}</h3>
                    <div id="personal-projects-list">${t('loading')}</div>
                    <button class="btn btn-primary btn-small" onclick="openAddPersonalProjectModal()" style="margin-top:12px;">${t('addPersonalProject') || 'Add Personal Project'}</button>
                </div>
            `;
            profileContent.innerHTML = html;
            
            // 加载我的项目
            loadMyProjects();
            loadPersonalProjects();
            
        } else {
            profileContent.innerHTML = `<p style="color:#e74c3c;">${data.message || t('error')}</p>`;
        }
    } catch (err) {
        profileContent.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
    }
}

/**
 * 加载我的项目
 */
async function loadMyProjects() {
    const myProjectsList = document.getElementById('my-projects-list');
    if (!myProjectsList) return;
    myProjectsList.innerHTML = `<div class="loading">${t('loading')}</div>`;
    
    try {
        const res = await fetch('../backend/api/api.php?action=get_my_subscribable_projects');
        const data = await res.json();
        
        if (data.code === 200 && data.projects) {
            if (data.projects.length === 0) {
                myProjectsList.innerHTML = `<p style="text-align:center;color:#999;">${t('noProjects')}</p>`;
                return;
            }
            
            let html = '<ul>';
            data.projects.forEach(project => {
                html += `<li>${escapeHtml(project.title)} (${project.status})</li>`;
            });
            html += '</ul>';
            myProjectsList.innerHTML = html;
        } else {
            myProjectsList.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
        }
    } catch (err) {
        myProjectsList.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
    }
}

// ===== 個人項目功能 =====
async function loadPersonalProjects() {
    const list = document.getElementById('personal-projects-list');
    if (!list) return;
    list.innerHTML = `<div class="loading">${t('loading')}</div>`;
    try {
        const res = await fetch('../backend/api/api.php?action=get_personal_projects');
        const data = await res.json();
        if (data.code === 200 && data.projects) {
            if (data.projects.length === 0) {
                list.innerHTML = `<p style="text-align:center;color:#999;">${t('noPersonalProjects') || 'No personal projects yet'}</p>`;
                return;
            }
            let html = '<div class="personal-projects-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;">';
            data.projects.forEach(p => {
                html += `
                    <div class="personal-project-card" style="border:1px solid #ddd;border-radius:8px;padding:12px;background:#fff;display:flex;flex-direction:column;">
                        ${p.image ? `<img src="${escapeHtml(p.image)}" alt="Project" style="width:100%;height:140px;object-fit:cover;border-radius:4px;margin-bottom:8px;">` : ''}
                        <h4 style="margin:0 0 8px 0;font-size:15px;">${escapeHtml(p.title)}</h4>
                        <p style="flex:1;font-size:12px;color:#555;margin:0 0 8px 0;">${escapeHtml(p.description || '')}</p>
                        ${p.link ? `<a href="${escapeHtml(p.link)}" target="_blank" style="font-size:12px;color:#667eea;text-decoration:none;margin-bottom:8px;">${t('viewProject') || 'View'}</a>` : ''}
                        <button class="btn btn-danger btn-small" onclick="deletePersonalProject(${p.id})">${t('delete')}</button>
                    </div>
                `;
            });
            html += '</div>';
            list.innerHTML = html;
        } else {
            list.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
        }
    } catch (e) {
        list.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
    }
}

function openAddPersonalProjectModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;';
    modal.innerHTML = `
        <div class="modal-content" style="background:#fff;padding:24px;border-radius:10px;width:90%;max-width:480px;">
            <h3 style="margin-top:0;">${t('addPersonalProject') || 'Add Personal Project'}</h3>
            <input id="ppTitle" type="text" placeholder="${t('projectTitle')}" style="width:100%;margin-bottom:10px;padding:8px;border:1px solid #ddd;border-radius:4px;">
            <textarea id="ppDesc" placeholder="${t('projectDescription')}" style="width:100%;margin-bottom:10px;padding:8px;border:1px solid #ddd;border-radius:4px;height:80px;"></textarea>
            <input id="ppImage" type="text" placeholder="${t('projectImageUrl') || 'Image URL'}" style="width:100%;margin-bottom:10px;padding:8px;border:1px solid #ddd;border-radius:4px;">
            <input id="ppLink" type="text" placeholder="${t('projectLink') || 'Project Link'}" style="width:100%;margin-bottom:16px;padding:8px;border:1px solid #ddd;border-radius:4px;">
            <div style="display:flex;gap:8px;justify-content:flex-end;">
                <button class="btn btn-secondary btn-small" onclick="this.closest('.modal').remove()">${t('cancel')}</button>
                <button class="btn btn-primary btn-small" onclick="submitPersonalProject()">${t('add') || 'Add'}</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
}

async function submitPersonalProject() {
    const title = document.getElementById('ppTitle').value.trim();
    const description = document.getElementById('ppDesc').value.trim();
    const image = document.getElementById('ppImage').value.trim();
    const link = document.getElementById('ppLink').value.trim();
    if (!title) { alert(t('projectTitleRequired') || 'Title required'); return; }
    try {
        const res = await fetch('../backend/api/api.php?action=add_personal_project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, image, link })
        });
        const data = await res.json();
        if (data.code === 200) {
            document.querySelector('.modal').remove();
            loadPersonalProjects();
        } else {
            alert(data.message);
        }
    } catch (e) { alert(t('error')); }
}

async function deletePersonalProject(projectId) {
    if (!confirm(t('confirmDelete') || 'Delete?')) return;
    try {
        const res = await fetch('../backend/api/api.php?action=delete_personal_project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId })
        });
        const data = await res.json();
        if (data.code === 200) {
            loadPersonalProjects();
        } else { alert(data.message); }
    } catch (e) { alert(t('error')); }
}

/**
 * 添加技能
 */
async function addSkill() {
    const skillInput = document.getElementById('newSkillInput');
    const skill = skillInput.value.trim();
    
    if (!skill) {
        alert(t('enterSkill'));
        return;
    }
    
    try {
        const res = await fetch('../backend/api/api.php?action=add_skill', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skill: skill })
        });
        const data = await res.json();
        
        if (data.code === 200) {
            skillInput.value = '';
            loadProfile(); // 重新加载资料以更新技能列表
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert(t('error'));
    }
}

/**
 * 搜索创作者
 */
async function searchCreators() {
    const searchInput = document.getElementById('skillSearchInput');
    const tags = searchInput.value.trim();
    const creatorsList = document.getElementById('creators-list');
    
    if (!tags) {
        creatorsList.innerHTML = `<p style="text-align:center;color:#999;">${t('enterTags')}</p>`;
        return;
    }
    
    creatorsList.innerHTML = `<div class="loading">${t('searching')}</div>`;
    
    try {
        const res = await fetch(`../backend/api/api.php?action=get_matching_creators&tags=${encodeURIComponent(tags)}`);
        const data = await res.json();
        
        if (data.code === 200 && data.creators) {
            if (data.creators.length === 0) {
                creatorsList.innerHTML = `<p style="text-align:center;color:#999;">${t('noCreatorsFound')}</p>`;
                return;
            }
            
            let html = '<div class="creator-list">';
            data.creators.forEach(creator => {
                const skills = parseSkills(creator.skills);
                html += `
                    <div class="creator-card">
                        <div class="creator-info">
                            <img src="${creator.avatar && creator.avatar.trim() ? creator.avatar : './assets/images/avatar_32.png'}" alt="Avatar" class="creator-avatar">
                            <div>
                                <h3>${escapeHtml(creator.username)}</h3>
                                <p>${t('reputationScore')}: ${creator.reputation_score}</p>
                            </div>
                        </div>
                        <div class="skill-tags">
                            ${skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            creatorsList.innerHTML = html;
        } else {
            creatorsList.innerHTML = `<p style="color:#e74c3c;">${data.message || t('error')}</p>`;
        }
    } catch (err) {
        creatorsList.innerHTML = `<p style="color:#e74c3c;">${t('error')}</p>`;
    }
}

// 暴露给全局
window.loadProfile = loadProfile;
window.addSkill = addSkill;
window.searchCreators = searchCreators;
window.loadMyProjects = loadMyProjects;
window.loadPersonalProjects = loadPersonalProjects;
window.openAddPersonalProjectModal = openAddPersonalProjectModal;
window.submitPersonalProject = submitPersonalProject;
window.deletePersonalProject = deletePersonalProject;
