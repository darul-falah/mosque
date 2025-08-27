# Darul Falah Mosque Website

A modern, responsive website for Darul Falah Mosque built with HTML5, CSS3, Bootstrap, and JavaScript. Designed to serve the Muslim community with essential information and services.

## Features

- **Responsive Design**: Mobile-first approach that works on all devices
- **Prayer Times**: Dynamic prayer time display with automatic highlighting of next prayer
- **News & Announcements**: Community updates and important announcements
- **Live Streaming**: Integration for Friday prayers and special events
- **Services Information**: Comprehensive listing of mosque services and programs
- **Contact Information**: Easy access to mosque contact details and location
- **Donation System**: Information and links for community donations
- **Email Subscriptions**: Newsletter signup functionality
- **Social Media Integration**: Links to all mosque social media platforms
- **Accessibility**: WCAG 2.1 compliant with screen reader support

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5.3
- **Icons**: Font Awesome 6.4
- **Hosting**: GitHub Pages
- **Version Control**: Git

## Project Structure

```
darul-falah-mosque/
├── index.html                 # Homepage
├── prayer-times.html          # Prayer times page
├── services.html              # Services and departments
├── news.html                  # News and announcements
├── contact.html               # Contact information
├── donations.html             # Donation page
├── live-stream.html           # Live streaming page
├── assets/
│   ├── css/
│   │   └── main.css          # Custom styles
│   ├── js/
│   │   ├── main.js           # Main JavaScript functionality
│   │   └── prayer-times.js   # Prayer times functionality
│   └── images/               # Website images
├── _config.yml               # GitHub Pages configuration
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Git
- A GitHub account
- A text editor or IDE

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/darul-falah-mosque.git
   cd darul-falah-mosque
   ```

2. **Open the website**
   - Open `index.html` in your web browser
   - Or use a local server like Live Server in VS Code

3. **Make changes**
   - Edit HTML, CSS, and JavaScript files as needed
   - Test changes in your browser

### Deployment to GitHub Pages

1. **Create a GitHub repository**
   - Go to GitHub and create a new repository named `darul-falah-mosque`
   - Make it public for GitHub Pages to work

2. **Push your code**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/darul-falah-mosque.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to Pages section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

4. **Access your website**
   - Your site will be available at `https://yourusername.github.io/darul-falah-mosque`
   - It may take a few minutes for the site to be live

### Custom Domain (Optional)

1. **Add CNAME file**
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Configure DNS**
   - Add A records pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

## Customization

### Prayer Times

Edit `assets/js/prayer-times.js` to update prayer times:

```javascript
const prayerTimesData = {
    "2025-01-15": {
        "fajr": {"adhan": "06:30", "iqamah": "06:45"},
        "dhuhr": {"adhan": "12:15", "iqamah": "12:30"},
        // ... more prayers
    }
};
```

### Contact Information

Update contact details in:
- `index.html` (footer section)
- `_config.yml` (site configuration)
- Individual page headers

### Colors and Styling

Modify CSS variables in `assets/css/main.css`:

```css
:root {
    --primary-color: #2c5530;
    --secondary-color: #d4af37;
    --accent-color: #1a4b1e;
    /* ... more variables */
}
```

### News and Announcements

Add news articles by editing the `featuredNews` array in `assets/js/main.js` or create individual HTML files for full articles.

## Content Management

### Adding News Articles

1. Edit `assets/js/main.js`
2. Add new article to `featuredNews` array
3. Create detailed article page in `news/` directory (optional)

### Updating Prayer Times

1. Edit `assets/js/prayer-times.js`
2. Update `prayerTimesData` object with new dates and times
3. Consider integrating with prayer times API for automatic updates

### Adding Services

1. Edit `services.html`
2. Add new service cards following existing structure
3. Update navigation if needed

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized images (WebP with fallbacks)
- Minified CSS and JavaScript
- CDN delivery for Bootstrap and Font Awesome
- Lazy loading for images
- Compressed assets

## Accessibility

- WCAG 2.1 AA compliant
- Screen reader compatible
- Keyboard navigation support
- High contrast ratios
- Alternative text for images
- Semantic HTML structure

## Security

- HTTPS enforced via GitHub Pages
- No sensitive data storage
- External links with `rel="noopener"`
- Input validation for forms
- XSS prevention measures

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Support

For technical support or questions:
- Create an issue on GitHub
- Contact: info@darulfalah.org
- Phone: +1 (234) 567-890

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bootstrap team for the excellent CSS framework
- Font Awesome for the icon library
- Islamic Cultural Centre of Ireland for design inspiration
- The Muslim community for their support and feedback

---

**Built with ❤️ for the Darul Falah Mosque community**
