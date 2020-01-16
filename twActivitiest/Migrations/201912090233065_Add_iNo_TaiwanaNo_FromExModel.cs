namespace twActivitiest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_iNo_TaiwanaNo_FromExModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Exhibitions", "iNo", c => c.Int(nullable: false));
            AddColumn("dbo.Exhibitions", "TainanNo", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Exhibitions", "TainanNo");
            DropColumn("dbo.Exhibitions", "iNo");
        }
    }
}
