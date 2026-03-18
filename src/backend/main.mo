import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

actor {

  // ── Migration: preserve old task stable variables so they can be discarded ──
  type OldTaskPriority = { #High; #Medium; #Low };
  type OldTaskCategory = { #Work; #Personal; #Other };
  type OldTask = {
    id : Nat;
    title : Text;
    priority : OldTaskPriority;
    category : OldTaskCategory;
    dueDate : ?Int;
    completed : Bool;
    createdAt : Int;
  };
  stable var nextTaskId : Nat = 0;
  stable var tasks : Map.Map<Nat, OldTask> = Map.empty<Nat, OldTask>();

  // ── Face care types ──
  type ProductCategory = { #Cleanser; #Toner; #Serum; #Moisturizer; #SPF; #Other };

  type Product = {
    id : Nat;
    name : Text;
    brand : Text;
    category : ProductCategory;
    notes : Text;
  };

  type RoutineStep = {
    productId : Nat;
    instructions : Text;
    order : Nat;
  };

  type RoutineType = { #Morning; #Evening };

  type JournalEntry = {
    id : Nat;
    date : Text;
    skinCondition : Nat;
    notes : Text;
    concerns : Text;
    createdAt : Int;
  };

  type SkinType = { #All; #Oily; #Dry; #Combination; #Sensitive };

  type Tip = {
    id : Nat;
    title : Text;
    content : Text;
    skinType : SkinType;
  };

  stable var nextProductId : Nat = 0;
  stable var nextJournalId : Nat = 0;
  stable var products : Map.Map<Nat, Product> = Map.empty<Nat, Product>();
  stable var journalEntries : Map.Map<Nat, JournalEntry> = Map.empty<Nat, JournalEntry>();
  stable var morningRoutine : [RoutineStep] = [];
  stable var eveningRoutine : [RoutineStep] = [];

  let tips : [Tip] = [
    { id = 0; title = "Double Cleansing"; content = "Use an oil-based cleanser first to remove makeup and sunscreen, then follow with a water-based cleanser to remove remaining impurities."; skinType = #All },
    { id = 1; title = "Always Use SPF"; content = "Apply SPF 30+ every morning, even on cloudy days. UV rays are the leading cause of premature aging."; skinType = #All },
    { id = 2; title = "Hydrate, Not Moisturize"; content = "Oily skin still needs hydration. Use lightweight, water-based moisturizers to balance oil production."; skinType = #Oily },
    { id = 3; title = "Gentle Cleansing"; content = "Avoid harsh soaps. Use a creamy or milk cleanser that won't strip your skin's natural oils."; skinType = #Dry },
    { id = 4; title = "Zone Targeting"; content = "Use mattifying products on your T-zone and richer formulas on drier cheek areas."; skinType = #Combination },
    { id = 5; title = "Patch Test New Products"; content = "Always patch test new skincare products on your inner wrist for 24 hours before applying to your face."; skinType = #Sensitive },
    { id = 6; title = "Retinol Introduction"; content = "Start retinol use once a week at night and gradually increase frequency. Always follow with moisturizer."; skinType = #All },
    { id = 7; title = "Layer Lightest to Heaviest"; content = "Apply skincare products from thinnest to thickest consistency: toners -> serums -> moisturizers -> oils."; skinType = #All },
  ];

  public shared func addProduct(name : Text, brand : Text, category : ProductCategory, notes : Text) : async Nat {
    let id = nextProductId;
    nextProductId += 1;
    let product : Product = { id; name; brand; category; notes };
    products.add(id, product);
    id;
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public shared func updateProduct(id : Nat, name : Text, brand : Text, category : ProductCategory, notes : Text) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { products.add(id, { p with name; brand; category; notes }) };
    };
  };

  public shared func deleteProduct(id : Nat) : async () {
    products.remove(id);
  };

  public shared func setRoutine(routineType : RoutineType, steps : [RoutineStep]) : async () {
    switch routineType {
      case (#Morning) { morningRoutine := steps };
      case (#Evening) { eveningRoutine := steps };
    };
  };

  public query func getRoutine(routineType : RoutineType) : async [RoutineStep] {
    switch routineType {
      case (#Morning) { morningRoutine };
      case (#Evening) { eveningRoutine };
    };
  };

  public shared func addJournalEntry(date : Text, skinCondition : Nat, notes : Text, concerns : Text) : async Nat {
    let id = nextJournalId;
    nextJournalId += 1;
    let entry : JournalEntry = { id; date; skinCondition; notes; concerns; createdAt = Time.now() };
    journalEntries.add(id, entry);
    id;
  };

  public query func getAllJournalEntries() : async [JournalEntry] {
    journalEntries.values().toArray();
  };

  public shared func deleteJournalEntry(id : Nat) : async () {
    journalEntries.remove(id);
  };

  public query func getTips() : async [Tip] {
    tips;
  };
};
