// Contact Page
function renderContact() {
    return `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Contact Us</h2>
                    <p class="section-subtitle">We'd love to hear from you</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; max-width: 1000px; margin: 0 auto;">
                    <div>
                        <h3 style="margin-bottom: 30px;">Get In Touch</h3>
                        <form onsubmit="handleContactSubmit(event)" style="display: flex; flex-direction: column; gap: 20px;">
                            <div class="form-group">
                                <label>Your Name</label>
                                <input type="text" required placeholder="John Doe">
                            </div>
                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" required placeholder="john@example.com">
                            </div>
                            <div class="form-group">
                                <label>Subject</label>
                                <input type="text" required placeholder="How can we help?">
                            </div>
                            <div class="form-group">
                                <label>Message</label>
                                <textarea required placeholder="Your message..." style="min-height: 150px;"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-lg">
                                <i class="fas fa-paper-plane"></i> Send Message
                            </button>
                        </form>
                    </div>
                    
                    <div>
                        <h3 style="margin-bottom: 30px;">Contact Information</h3>
                        <div style="display: flex; flex-direction: column; gap: 25px;">
                            <div style="display: flex; gap: 20px; align-items: start;">
                                <i class="fas fa-map-marker-alt" style="font-size: 1.5rem; color: var(--primary); margin-top: 5px;"></i>
                                <div>
                                    <h4 style="margin-bottom: 5px;">Address</h4>
                                    <p style="color: var(--gray);">123 Vision Street<br>Eye City, EC 12345<br>United States</p>
                                </div>
                            </div>
                            <div style="display: flex; gap: 20px; align-items: start;">
                                <i class="fas fa-phone" style="font-size: 1.5rem; color: var(--primary); margin-top: 5px;"></i>
                                <div>
                                    <h4 style="margin-bottom: 5px;">Phone</h4>
                                    <p style="color: var(--gray);">+1 (555) 123-4567<br>Mon-Fri: 9am - 6pm EST</p>
                                </div>
                            </div>
                            <div style="display: flex; gap: 20px; align-items: start;">
                                <i class="fas fa-envelope" style="font-size: 1.5rem; color: var(--primary); margin-top: 5px;"></i>
                                <div>
                                    <h4 style="margin-bottom: 5px;">Email</h4>
                                    <p style="color: var(--gray);">info@eyecarehub.com<br>support@eyecarehub.com</p>
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 40px;">
                            <h4 style="margin-bottom: 15px;">Follow Us</h4>
                            <div style="display: flex; gap: 15px;">
                                <a href="#" class="icon-btn" style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; background: var(--primary); color: white; border-radius: 50%;">
                                    <i class="fab fa-facebook"></i>
                                </a>
                                <a href="#" class="icon-btn" style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; background: var(--primary); color: white; border-radius: 50%;">
                                    <i class="fab fa-twitter"></i>
                                </a>
                                <a href="#" class="icon-btn" style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; background: var(--primary); color: white; border-radius: 50%;">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                <a href="#" class="icon-btn" style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; background: var(--primary); color: white; border-radius: 50%;">
                                    <i class="fab fa-linkedin"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function handleContactSubmit(event) {
    event.preventDefault();
    showNotification('Message sent successfully! We\'ll get back to you soon.');
    event.target.reset();
}
