export default interface ReqModel {
  rq_id?: number;
  request_date: string;
  isFulfilled: boolean;
  request_meeting_point: string;
  isUrgent: boolean;
  request_destination: string;
}
