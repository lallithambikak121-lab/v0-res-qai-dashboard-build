# ResQAI Deployment Checklist

## Pre-Deployment Setup

### Clerk Authentication
- [ ] Create Clerk account at https://clerk.com
- [ ] Create new application in Clerk dashboard
- [ ] Copy Publishable Key to `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] Copy Secret Key to `CLERK_SECRET_KEY`
- [ ] Set Redirect URI in Clerk to your deployment URL
- [ ] Test login flow in development environment

### Supabase Database
- [ ] Create Supabase project at https://supabase.com
- [ ] Copy Project URL to `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy Anon Key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copy Service Role Key to `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Go to SQL Editor in Supabase dashboard
- [ ] Execute `scripts/001_schema.sql` to create tables
- [ ] Execute `scripts/002_seed.sql` to add sample data
- [ ] Verify all 6 tables were created (profiles, weather_data, alerts, resources, risk_assessments, action_plans)
- [ ] Check RLS policies are enabled on all tables

### Environment Variables
Set these in your Vercel project settings:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

## Testing Checklist

### Authentication Flow
- [ ] Unauthenticated user redirected to `/login`
- [ ] Sign in form loads correctly
- [ ] Can sign up with email
- [ ] Can sign in with existing account
- [ ] Redirect to `/dashboard` after successful login
- [ ] User button appears in top-nav
- [ ] Sign out functionality works
- [ ] Logged out user cannot access `/dashboard`

### API Routes
- [ ] `GET /api/weather` returns valid weather data
- [ ] `GET /api/alerts` returns active alerts
- [ ] `GET /api/resources` returns available resources
- [ ] `POST /api/analyze` calculates risk scores
- [ ] All routes require authentication (401 for unauthenticated)
- [ ] API errors are handled gracefully

### Dashboard
- [ ] Alerts display in QuickAlerts component
- [ ] Resources are visible in ResourcePanel
- [ ] Risk scores update in KPI cards
- [ ] Heatmap displays all states
- [ ] Action plan shows next steps
- [ ] What-if simulation works
- [ ] Offline mode is functional
- [ ] Language switching works (EN/HI/TA)

### Performance
- [ ] Alerts auto-refresh every 30 seconds
- [ ] No unnecessary API calls
- [ ] SWR caching working (no duplicate requests)
- [ ] Page loads in under 2 seconds
- [ ] Responsive design on mobile/tablet/desktop

## Post-Deployment

### Monitoring
- [ ] Set up Vercel analytics
- [ ] Monitor API response times
- [ ] Check error rates in browser console
- [ ] Review Supabase database performance
- [ ] Set up alerts for failed deployments

### Data Management
- [ ] Verify real alerts are being created
- [ ] Check resources are updating correctly
- [ ] Monitor risk assessment accuracy
- [ ] Review historical data in database
- [ ] Implement data retention policies

### Security
- [ ] Verify RLS policies are protecting data
- [ ] Check that users can only see appropriate data
- [ ] Review API rate limits
- [ ] Enable CORS restrictions if needed
- [ ] Audit Clerk authentication logs

## Troubleshooting Common Issues

### "401 Unauthorized" errors
**Solution:** Check that Clerk environment variables are set correctly
```bash
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY
```

### Dashboard shows empty alerts
**Solution:** 
1. Check Supabase alerts table has data: `SELECT * FROM alerts;`
2. Verify API endpoint is responding: `curl https://yourapp.com/api/alerts`
3. Check browser console for network errors
4. Ensure authentication token is being sent

### SWR not updating data
**Solution:**
1. Check `refreshInterval` in use-api.ts hooks
2. Verify API endpoint is returning new data
3. Clear browser cache and reload
4. Check browser DevTools Network tab for requests

### Database tables not created
**Solution:**
1. Verify `scripts/001_schema.sql` was executed fully
2. Check Supabase SQL Editor for errors
3. Run each CREATE TABLE statement individually
4. Verify `Supabase Service Role Key` has permissions

### Clerk sign-in page not showing
**Solution:**
1. Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
2. Verify Clerk application is published
3. Check Redirect URIs in Clerk dashboard include your domain
4. Clear browser cache and cookies

## Rollback Procedure

If issues occur after deployment:

1. **Immediate:** Revert to previous Vercel deployment from deployments page
2. **Database:** No data loss - use Supabase backups if needed
3. **Auth:** Clear Clerk session cache and try again
4. **Communication:** Notify team of issues and ETA for fix

## Performance Optimization (Future)

- Implement database indexing for common queries
- Add caching layer with Upstash Redis
- Optimize image assets
- Implement code splitting for dashboard components
- Add service worker for offline capabilities
- Use CDN for static assets

## Monitoring Metrics

Track these after deployment:
- API response times (target: <100ms)
- Database query times (target: <50ms)
- Page load time (target: <2s)
- Authentication success rate (target: >99%)
- Alert update frequency (target: <30s)
- Resource utilization (target: <70% memory)
- Error rate (target: <0.1%)

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Status:** _______________
**Notes:** _________________________________________________________________
