namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updateMessagedate : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Messages", "time", c => c.DateTime());
            DropColumn("dbo.Messages", "InitDate");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Messages", "InitDate", c => c.DateTime());
            AlterColumn("dbo.Messages", "time", c => c.DateTime(nullable: false));
        }
    }
}
