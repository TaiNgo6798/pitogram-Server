import { UserEntity } from './../models/user.entity'
import { PostEntity } from 'models/post.entity'
import { ObjectID } from 'mongodb'
import { Tag } from './../generator/graphql.schema'
import { ReportEntity } from 'models/report.entity'
import { getMongoManager } from 'typeorm'
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
@Resolver('Report')
export class ReportResolver {
	constructor() {}
	@Query()
	async reports() {
		const res = await getMongoManager().find(ReportEntity, {})
		return res
	}
	@Mutation()
	async createReport(@Args('report') report): Promise<any> {
		try {
			const { reporterID, postID, message } = report
			const currentReporter = await getMongoManager().findOne(
				UserEntity,
				reporterID
			)
			const post = await getMongoManager().findOne(PostEntity, postID)
			const poster = await getMongoManager().findOne(UserEntity, post.idWho)
			console.log(poster)
			const reporter = await getMongoManager().findOne(UserEntity, reporterID)
			const reportList = await getMongoManager().find(ReportEntity, { postID })
			const countReport = reportList
				? (await reportList.filter(e => e.postID === postID).length) + 1
				: 1
			for (const r of reportList) {
				const update = await getMongoManager().findOneAndUpdate(
					ReportEntity,
					{
						_id: new ObjectID(r._id)
					},
					{
						$set: { reportCount: countReport }
					}
				)
			}
			const newReport = new ReportEntity({
				reporterID,
				postID,
				message,
				posterID: poster._id,
				posterName: poster.firstName + ' ' + poster.lastName,
				reporterName: reporter.firstName + ' ' + reporter.lastName,
				reportCount: countReport,
				tags: post.tags,
				createDate: post.time
			})
			//
			const savedReport = await getMongoManager().save(ReportEntity, newReport)
			return true
		} catch (err) {
			console.log(err)
			return false
		}
	}
	@Mutation()
	async deleteReport(@Args('_id') _id): Promise<any> {
		try {
			const currentReport = await getMongoManager().findOne(ReportEntity, _id)
			const reportList = await getMongoManager().find(ReportEntity, {
				postID: currentReport.postID
			})
			for (const r of reportList) {
				const update = await getMongoManager().findOneAndUpdate(
					ReportEntity,
					{
						_id: new ObjectID(r._id)
					},
					{
						$set: { reportCount: r.reportCount - 1 }
					}
				)
			}
			const deletedTag = await getMongoManager().findOneAndDelete(
				ReportEntity,
				{
					_id: new ObjectID(_id)
				}
			)
			return true
		} catch (err) {
			return false
		}
	}
}
