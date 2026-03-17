from pymongo import MongoClient

def verify_schema():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['career_auto']
    
    accounts = db['AccountLogins']
    profiles = db['UserProfiles']
    
    print(f"AccountLogins count: {accounts.count_documents({})}")
    print(f"UserProfiles count: {profiles.count_documents({})}")
    
    # Check for consistency
    for account in accounts.find():
        profile_id = account.get('profile_id')
        if not profile_id:
            print(f"Error: Account {account['email']} has no profile_id")
            continue
            
        profile = profiles.find_one({'_id': profile_id})
        if not profile:
            print(f"Error: Profile {profile_id} not found for account {account['email']}")
        else:
            print(f"Verified linkage for: {account['email']} <-> Profile ID: {profile_id}")

if __name__ == "__main__":
    verify_schema()
