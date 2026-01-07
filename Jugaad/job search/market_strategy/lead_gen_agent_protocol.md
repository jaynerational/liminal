# Lead Generation Agent Protocol

## Mission
To continuously source alumni leads and job listings that match Jayaditya's high-leverage profile (CAT 99.2, 838% ROI).

## Core Protocol
### 1. Alumni Intelligence
- **Target Schools**: NIT Warangal (Engineering), IIFT/XLRI (MBA Context).
- **Target Firms**: McKinsey, BCG, Google, Amazon, Swiggy, Zomato.
- **Search Query**: `"[School Name]" alumni at "[Firm Name]" India LinkedIn`.
- **Filtering**: Prioritize "Ex-[Competitor]" profiles (e.g., Ex-BCG now at Swiggy) as they value the ROI-first mindset.

### 2. Job Listing Intelligence
- **Keywords**: "Associate Consultant", "Product Manager", "Operations Lead", "Growth Manager".
- **Source Hubs**: 
    - Company Career Portals (McKinsey, BCG, Google).
    - Aggregators: Instahyre, LinkedIn, AmbitionBox.
- **Verification**: Check for roles posted within the last 14 days.

### 3. Integration
- Add new candidates to `alumni_leads.json`.
- Add new job links to `job_listings.json`.
- Trigger outreach using `linkedin_outreach.md`.

## Automation Script (Pseudo-Code for Future Implementation)
```python
def generate_leads():
    schools = ["NIT Warangal", "IIFT Delhi", "XLRI"]
    firms = ["McKinsey", "BCG", "Google", "Amazon", "Swiggy", "Zomato"]
    
    for school in schools:
        for firm in firms:
            query = f"{school} alumni at {firm} India -linkedin"
            results = browser.search_and_extract_profiles(query)
            alumni_db.update(results)
```
