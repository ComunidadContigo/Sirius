export default interface ReqModel {
  rq_id?: number;
  request_date: string;
  is_fulfilled: boolean;
  is_in_progress: boolean;
  request_meeting_point: string;
  is_urgent: boolean;
  request_destination: string;
  r_id?: number;
  b_id?: number;
}
