// Settings Page
function renderSettings() {
    return `
        <div class="table-container">
            <h3>General Settings</h3>
            <form id="settingsForm" onsubmit="saveSettings(event)" style="margin-top: 20px;">
                <div class="form-row">
                    <div class="form-group">
                        <label>Store Name</label>
                        <input type="text" value="EyeCareHub" required>
                    </div>
                    <div class="form-group">
                        <label>Contact Email</label>
                        <input type="email" value="info@eyecarehub.com" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" value="+1 (555) 123-4567" required>
                    </div>
                    <div class="form-group">
                        <label>Currency</label>
                        <select>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Store Address</label>
                    <textarea>123 Vision Street, Eye City, EC 12345</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tax Rate (%)</label>
                        <input type="number" value="8.5" step="0.1" min="0">
                    </div>
                    <div class="form-group">
                        <label>Shipping Fee ($)</label>
                        <input type="number" value="5.99" step="0.01" min="0">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Save Settings
                </button>
            </form>
        </div>

        <div class="table-container" style="margin-top: 30px;">
            <h3>Notifications Settings</h3>
            <div style="margin-top: 20px;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; border-bottom: 1px solid #e5e7eb;">
                    <div>
                        <strong>Email Notifications</strong>
                        <div style="font-size: 0.9rem; color: #6b7280;">Receive email notifications for new orders</div>
                    </div>
                    <label style="position: relative; display: inline-block; width: 60px; height: 30px;">
                        <input type="checkbox" checked style="opacity: 0; width: 0; height: 0;">
                        <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #3b82f6; border-radius: 30px; transition: 0.4s;">
                            <span style="position: absolute; height: 22px; width: 22px; left: 4px; bottom: 4px; background: white; border-radius: 50%; transition: 0.4s;"></span>
                        </span>
                    </label>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; border-bottom: 1px solid #e5e7eb;">
                    <div>
                        <strong>SMS Alerts</strong>
                        <div style="font-size: 0.9rem; color: #6b7280;">Receive SMS for urgent notifications</div>
                    </div>
                    <label style="position: relative; display: inline-block; width: 60px; height: 30px;">
                        <input type="checkbox" style="opacity: 0; width: 0; height: 0;">
                        <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #d1d5db; border-radius: 30px; transition: 0.4s;">
                            <span style="position: absolute; height: 22px; width: 22px; left: 4px; bottom: 4px; background: white; border-radius: 50%; transition: 0.4s;"></span>
                        </span>
                    </label>
                </div>
            </div>
        </div>
    `;
}

function saveSettings(event) {
    event.preventDefault();
    alert('Settings saved successfully!');
}
