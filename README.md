```markdown
# Customer Support Triage Dashboard

A dashboard for triaging customer support messages, built in 24 hours for the 24-Hour Build Challenge.

## 🚀 Live Demo
[Deployed on Vercel]() - https://customer-support-dashboard-eta.vercel.app/

## 📋 Features

### Core Requirements
- ✅ 18 mock customer support messages with realistic data
- ✅ Automatic categorization (Bug, Billing, Feature Request, General)
- ✅ Priority assignment (Low, Medium, High)
- ✅ Summary dashboard with counts by category and priority
- ✅ Filter messages by category, priority, and status
- ✅ Clean, responsive UI built with Tailwind CSS

### Bonus Features
- ✅ Mark messages as Resolved/In Progress/New
- ✅ Visual indication of high-priority messages
- ✅ Status tracking and filtering
- ✅ Bulk actions (Mark All Resolved, Reset All)

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vercel** - Deployment

## 🏃‍♂️ Running Locally

1. Clone the repository:
```bash
git clone https://github.com/shaks21/customer-support-dashboard.git
cd customer-support-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How It Works

### Categorization Logic
The system uses keyword-based rules to categorize messages:

- **Bug**: Contains words like "crash", "error", "bug", "not working", "broken", "fail"
- **Billing**: Contains words like "invoice", "charge", "bill", "payment", "refund", "price"
- **Feature Request**: Contains words like "feature", "add", "request", "suggest", "integration", "would like"
- **General**: Default category when no specific keywords match

### Priority Assignment
Priority is determined by:
1. **Keyword detection**: Words like "urgent", "ASAP", "emergency" → High priority
2. **Category-based**: Bugs and Billing issues are automatically High priority
3. **Feature requests**: Generally Low priority
4. **Default**: Medium priority for general inquiries

### Data Flow
1. Mock messages are loaded with initial categorization
2. Users can filter by category, priority, and status
3. Users can update message status (New → In Progress → Resolved)
4. Dashboard updates in real-time with summary statistics
5. Bulk actions allow quick status updates across multiple messages

## ⏱️ Approach taken

- **Phase 1**: Project setup, planning, and architecture design
- **Phase 2**: Core components, data structure, and TypeScript setup
- **Phase 3**: UI implementation, styling, and responsive design
- **Phase 4**: Filtering functionality and interactive features
- **Phase 5**: Polish, testing, edge cases, and bug fixes
- **Phase 6**: Documentation, README, and deployment preparation
- **Phase 7**: Final review, adjustments, and submission preparation

## 📝 Design Decisions

### Technical Decisions
1. **Keyword-based categorization**: Chosen over AI for predictability and speed within the 24-hour constraint
2. **Client-side state management**: Used React state instead of database for simplicity
3. **Component-based architecture**: Modular components for maintainability
4. **TypeScript**: For type safety and better developer experience
5. **Tailwind CSS**: For rapid, consistent styling

### UX Decisions
1. **Card-based layout**: Easy to scan and works well on both desktop and mobile
2. **Color coding**: Visual hierarchy using consistent colors for priorities and categories
3. **Progressive disclosure**: Filters are expandable, showing active filters when in use
4. **One-click status updates**: Quick action buttons for changing message status
5. **Real-time updates**: Dashboard updates immediately when filters or statuses change

### Trade-offs Made
1. **No backend API**: All logic runs client-side for simplicity
2. **No authentication**: Since it's a demo/internal tool
3. **No persistent storage**: State resets on page refresh
4. **Simple categorization**: Keyword-based instead of ML/AI for reliability

## 🧪 Testing Notes

The dashboard has been tested for:
- Responsive design (mobile, desktop)
- Filter combinations work correctly
- Status updates persist during session
- Bulk actions affect all filtered messages
- Edge cases (empty filter results, etc.)

## 🔮 Future Improvements

If I had more time, I would implement:

### 1. **AI Integration**
- Use OpenAI API for more accurate and nuanced categorization
- Sentiment analysis to detect frustrated customers
- Automatic response suggestions

### 2. **Real Data Integration**
- Connect to real support systems (Zendesk, Intercom, Help Scout)
- Live sync with email inboxes
- Webhook support for real-time updates

### 3. **Advanced Filtering & Search**
- Full-text search across message content
- Date range filtering
- Customer segmentation filters
- Saved filter presets

### 4. **Analytics & Reporting**
- Charts showing trends over time (volume, resolution time)
- Team performance metrics
- Category distribution charts
- Peak hour analysis

### 5. **Team Collaboration Features**
- Assign messages to specific team members
- Internal notes and comments
- @mentions and notifications
- Team workload balancing

### 6. **Email Integration**
- Send responses directly from the dashboard
- Email templates and snippets
- Automated follow-up reminders
- Email threading

### 7. **Data Persistence & Scalability**
- Database integration (PostgreSQL, MongoDB)
- User authentication and permissions
- Audit logs for status changes
- Data backup and recovery

### 8. **Export & Integration**
- Export filtered views to CSV/PDF
- API for external system integration
- Webhook triggers for specific events
- Slack/Teams notifications

### 9. **Productivity Enhancements**
- Keyboard shortcuts for faster triaging
- Bulk edit operations
- Quick reply templates
- Macros for common actions

### 10. **User Experience**
- Dark mode theme option
- Customizable dashboard layout
- Personalized views per team member
- Mobile app version

### 11. **Advanced Features**
- SLA (Service Level Agreement) tracking
- Priority escalation rules
- Automated triaging rules
- Customer satisfaction tracking
- Integration with CRM systems

## 🙏 Acknowledgments

Built for the 24-Hour Build Challenge. Special thanks to:
- **Next.js team** for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons
- **Vercel** for seamless deployment
