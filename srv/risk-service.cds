using {cvx.poc.riskmanagement as my} from '../db/schema';

@path: 'service/risk'
service RiskService {
  
  entity Risks       as projection on my.Risks;
  annotate Risks with @odata.draft.enabled;
  entity Mitigations as projection on my.Mitigations;
  annotate Mitigations with @odata.draft.enabled;

  @cds.persistence.skip
  entity Diagnosis {
    System: String;
    Mandt: String;
    MessageId: String;
    Message: String;
    Type: String;
    TimeRange: String;
    Criticality: Integer;
    Icon: String;
  }
}
