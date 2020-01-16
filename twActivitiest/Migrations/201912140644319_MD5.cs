namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MD5 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Members", "MD5", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Members", "MD5");
        }
    }
}
