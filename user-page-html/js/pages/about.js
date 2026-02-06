// About Page
function renderAbout() {
    return `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">About EyeCareHub</h2>
                    <p class="section-subtitle">Your vision, our passion</p>
                </div>
                
                <div style="max-width: 800px; margin: 0 auto; text-align: center; padding: 40px 0;">
                    <p style="font-size: 1.2rem; line-height: 1.8; color: var(--gray); margin-bottom: 30px;">
                        Founded in 2020, EyeCareHub has been dedicated to providing premium eyewear solutions 
                        that combine style, comfort, and cutting-edge technology. We believe everyone deserves 
                        to see the world clearly and look great doing it.
                    </p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-top: 60px;">
                    <div style="text-align: center; padding: 30px;">
                        <i class="fas fa-eye" style="font-size: 3.5rem; color: var(--primary); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 15px;">Our Vision</h3>
                        <p style="color: var(--gray); line-height: 1.6;">
                            To be the world's most trusted source for quality eyewear, making premium vision 
                            care accessible to everyone.
                        </p>
                    </div>
                    <div style="text-align: center; padding: 30px;">
                        <i class="fas fa-bullseye" style="font-size: 3.5rem; color: var(--primary); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 15px;">Our Mission</h3>
                        <p style="color: var(--gray); line-height: 1.6;">
                            Deliver exceptional eyewear products and services that enhance our customers' quality 
                            of life through better vision and style.
                        </p>
                    </div>
                    <div style="text-align: center; padding: 30px;">
                        <i class="fas fa-heart" style="font-size: 3.5rem; color: var(--primary); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 15px;">Our Values</h3>
                        <p style="color: var(--gray); line-height: 1.6;">
                            Quality, integrity, and customer satisfaction guide everything we do. We're committed 
                            to excellence in every interaction.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    `;
}
